/**
 * signatureProcessor.js
 * -------------------------------------------------------------------------
 * Modul murni pemrosesan citra tanda tangan basah (Single Responsibility Principle).
 * Berfungsi untuk:
 * 1. Memuat citra secara asinkron (loadImage)
 * 2. Pemotongan manual / Framing (cropAndRotateImage)
 * 3. Penghapusan background kertas dengan normalisasi iluminasi adaptif (grid-based)
 * 4. Deteksi dan eliminasi garis tepi (table rules, border, garis margin) & noise
 * 5. Ekstraksi otomatis berbasis Connected Component Analysis & tight bounding box
 * 6. Pemangkasan ruang kosong transparan cerdas (autoTrimCanvas)
 * 7. Ekspor hasil ke file PNG resolusi tinggi tanpa blur (canvasToFile)
 * -------------------------------------------------------------------------
 */

/**
 * Memuat gambar dari File/Blob atau URL string ke dalam HTMLImageElement.
 * @param {File|Blob|string} source
 * @returns {Promise<HTMLImageElement>}
 */
export function loadImage(source) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';

        img.onload = () => resolve(img);
        img.onerror = (err) => reject(new Error('Gagal memuat gambar tanda tangan: ' + err));

        if (source instanceof Blob || source instanceof File) {
            img.src = URL.createObjectURL(source);
        } else if (typeof source === 'string') {
            img.src = source;
        } else {
            reject(new Error('Format sumber gambar tidak valid.'));
        }
    });
}

/**
 * Memotong gambar berdasarkan area persegi panjang (crop rectangle) dan rotasi.
 * @param {HTMLImageElement|HTMLCanvasElement} sourceImage
 * @param {{ x: number, y: number, width: number, height: number }} cropRect
 * @param {number} rotationDegrees - Rotasi gambar dalam kelipatan 90 derajat (0, 90, 180, 270)
 * @returns {HTMLCanvasElement}
 */
export function cropAndRotateImage(sourceImage, cropRect, rotationDegrees = 0) {
    const rawW = sourceImage.naturalWidth || sourceImage.width;
    const rawH = sourceImage.naturalHeight || sourceImage.height;

    const rotatedCanvas = document.createElement('canvas');
    const rot = ((rotationDegrees % 360) + 360) % 360;
    const isSideways = rot === 90 || rot === 270;

    rotatedCanvas.width = isSideways ? rawH : rawW;
    rotatedCanvas.height = isSideways ? rawW : rawH;

    const rCtx = rotatedCanvas.getContext('2d');
    rCtx.translate(rotatedCanvas.width / 2, rotatedCanvas.height / 2);
    rCtx.rotate((rot * Math.PI) / 180);
    rCtx.drawImage(sourceImage, -rawW / 2, -rawH / 2);

    if (!cropRect || cropRect.width <= 0 || cropRect.height <= 0) {
        return rotatedCanvas;
    }

    const cropCanvas = document.createElement('canvas');
    cropCanvas.width = Math.max(10, Math.floor(cropRect.width));
    cropCanvas.height = Math.max(10, Math.floor(cropRect.height));
    const cCtx = cropCanvas.getContext('2d');

    cCtx.drawImage(
        rotatedCanvas,
        cropRect.x, cropRect.y, cropRect.width, cropRect.height,
        0, 0, cropCanvas.width, cropCanvas.height
    );

    return cropCanvas;
}

/**
 * Membangun peta estimasi kertas lokal (grid-based local background estimation).
 * Mengatasi bayangan gradien ponsel, sudut gelap, dan ketidakseragaman pencahayaan.
 * @param {Uint8ClampedArray} data
 * @param {number} width
 * @param {number} height
 * @param {number} [blockSize=24]
 * @returns {(x: number, y: number) => number}
 */
function buildLocalPaperEstimator(data, width, height, blockSize = 24) {
    const gridW = Math.ceil(width / blockSize);
    const gridH = Math.ceil(height / blockSize);
    const gridPaper = new Float32Array(gridW * gridH);

    for (let gy = 0; gy < gridH; gy++) {
        const startY = gy * blockSize;
        const endY = Math.min(height, startY + blockSize);

        for (let gx = 0; gx < gridW; gx++) {
            const startX = gx * blockSize;
            const endX = Math.min(width, startX + blockSize);

            const samples = [];
            for (let y = startY; y < endY; y += 2) {
                const row = y * width;
                for (let x = startX; x < endX; x += 2) {
                    const i = (row + x) * 4;
                    const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
                    samples.push(lum);
                }
            }

            if (samples.length > 0) {
                samples.sort((a, b) => a - b);
                // Persentil ke-90 pada blok lokal mewakili warna kertas pada area tersebut
                const p90 = samples[Math.floor(samples.length * 0.90)];
                gridPaper[gy * gridW + gx] = Math.max(150, p90);
            } else {
                gridPaper[gy * gridW + gx] = 230;
            }
        }
    }

    return function getLocalPaper(x, y) {
        const gx = Math.min(gridW - 1, Math.max(0, Math.floor(x / blockSize)));
        const gy = Math.min(gridH - 1, Math.max(0, Math.floor(y / blockSize)));
        return gridPaper[gy * gridW + gx];
    };
}

/**
 * Menganalisis citra biner kandidat tinta dan mengelompokkannya ke dalam Connected Components.
 * Menyaring bintik debu (noise) dan garis lurus buatan (border tabel, garis margin, garis lipatan).
 * 
 * @param {Uint8Array} mask - Grid 1 untuk tinta, 0 untuk kertas
 * @param {number} width
 * @param {number} height
 * @returns {Array<{ count: number, minX: number, maxX: number, minY: number, maxY: number, w: number, h: number }>}
 */
function extractSignatureComponents(mask, width, height) {
    const visited = new Uint8Array(width * height);
    const validComponents = [];

    for (let y = 0; y < height; y++) {
        const rowOffset = y * width;
        for (let x = 0; x < width; x++) {
            const idx = rowOffset + x;
            if (mask[idx] && !visited[idx]) {
                // BFS 8-Neighborhood Flood Fill
                const queue = [idx];
                visited[idx] = 1;
                let qHead = 0;

                let minX = x;
                let maxX = x;
                let minY = y;
                let maxY = y;
                let count = 0;

                while (qHead < queue.length) {
                    const curr = queue[qHead++];
                    count++;
                    const cx = curr % width;
                    const cy = Math.floor(curr / width);

                    if (cx < minX) minX = cx;
                    if (cx > maxX) maxX = cx;
                    if (cy < minY) minY = cy;
                    if (cy > maxY) maxY = cy;

                    for (let dy = -1; dy <= 1; dy++) {
                        const ny = cy + dy;
                        if (ny < 0 || ny >= height) continue;
                        const nrow = ny * width;
                        for (let dx = -1; dx <= 1; dx++) {
                            const nx = cx + dx;
                            if (nx < 0 || nx >= width) continue;
                            const nidx = nrow + nx;
                            if (mask[nidx] && !visited[nidx]) {
                                visited[nidx] = 1;
                                queue.push(nidx);
                            }
                        }
                    }
                }

                const compW = maxX - minX + 1;
                const compH = maxY - minY + 1;

                // 1. Abaikan noise / bintik debu mikro (< 10 piksel)
                if (count < 10) continue;

                // 2. Eliminasi GARIS VERTIKAL LURUS (misal: garis tabel, margin formulir, tepi bayangan kertas)
                // Ditandai dengan tinggi signifikan, lebar sangat sempit (<= 5px), dan rasio aspek tinggi/lebar >= 4.5
                const isVerticalLine = (compH >= 35 && compW <= 5 && (compH / compW) >= 4.5) ||
                                       (compH >= height * 0.45 && compW <= 8);
                if (isVerticalLine) continue;

                // 3. Eliminasi GARIS HORIZONTAL LURUS (misal: garis bawah tanda tangan, pemisah tabel)
                const isHorizontalLine = (compW >= 45 && compH <= 5 && (compW / compH) >= 6) ||
                                         (compW >= width * 0.50 && compH <= 8);
                if (isHorizontalLine) continue;

                // 4. Eliminasi komponen yang menempel di tepi luar foto (tepi frame kamera / meja)
                const touchesPerimeter = (minX <= 2 || maxX >= width - 3 || minY <= 2 || maxY >= height - 3);
                if (touchesPerimeter && (compW >= width * 0.45 || compH >= height * 0.45)) {
                    continue;
                }

                validComponents.push({
                    count,
                    minX, maxX, minY, maxY,
                    w: compW,
                    h: compH,
                });
            }
        }
    }

    return validComponents;
}

/**
 * Menemukan Bounding Box Tanda Tangan paling akurat dan bersih.
 * @param {HTMLImageElement|HTMLCanvasElement} img
 * @returns {{ cropX: number, cropY: number, cropW: number, cropH: number }}
 */
function findAccurateSignatureBounds(img) {
    const rawW = img.naturalWidth || img.width;
    const rawH = img.naturalHeight || img.height;

    // Skala kerja analisis (~600px) untuk kecepatan dan penghapusan noise global
    const scale = Math.min(1.0, 600 / Math.max(rawW, rawH));
    const anaW = Math.max(10, Math.round(rawW * scale));
    const anaH = Math.max(10, Math.round(rawH * scale));

    const canvas = document.createElement('canvas');
    canvas.width = anaW;
    canvas.height = anaH;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(img, 0, 0, anaW, anaH);

    const imgData = ctx.getImageData(0, 0, anaW, anaH);
    const data = imgData.data;

    // Peta kecerahan latar lokal
    const getLocalBg = buildLocalPaperEstimator(data, anaW, anaH, 20);

    // Grid biner tinta kandidat
    const mask = new Uint8Array(anaW * anaH);

    // Kumpulkan kandidat tinta (abaikan 2% batas ekstrem)
    const marginX = Math.round(anaW * 0.02);
    const marginY = Math.round(anaH * 0.02);

    for (let y = marginY; y < anaH - marginY; y++) {
        const row = y * anaW;
        for (let x = marginX; x < anaW - marginX; x++) {
            const i = (row + x) * 4;
            const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
            const bg = getLocalBg(x, y);
            const delta = bg - lum;
            const relDelta = delta / Math.max(1, bg);

            // Syarat tinta: kontras relatif memadai terhadap kertas sekitar dan bukan putih
            if (delta >= 28 && relDelta >= 0.15 && lum <= 210) {
                mask[row + x] = 1;
            }
        }
    }

    // Ekstraksi komponen terhubung bebas garis tepi
    const components = extractSignatureComponents(mask, anaW, anaH);

    if (components.length === 0) {
        // Fallback aman: fokus pada area tengah 75%
        const padX = Math.round(rawW * 0.12);
        const padY = Math.round(rawH * 0.15);
        return {
            cropX: padX,
            cropY: padY,
            cropW: Math.max(10, rawW - padX * 2),
            cropH: Math.max(10, rawH - padY * 2),
        };
    }

    // Cari komponen terbesar sebagai inti tanda tangan (Anchor component)
    components.sort((a, b) => b.count - a.count);
    const mainComp = components[0];

    // Kumpulkan semua komponen yang berdekatan dengan tanda tangan utama
    // (misal: coretan terpisah, titik i, garis silang t, atau nama sambung)
    const maxDistance = Math.max(45, Math.round(Math.max(mainComp.w, mainComp.h) * 0.6));
    const cluster = components.filter((c) => {
        const dx = Math.max(0, Math.max(mainComp.minX - c.maxX, c.minX - mainComp.maxX));
        const dy = Math.max(0, Math.max(mainComp.minY - c.maxY, c.minY - mainComp.maxY));
        return Math.hypot(dx, dy) <= maxDistance;
    });

    let bMinX = Math.min(...cluster.map((c) => c.minX));
    let bMaxX = Math.max(...cluster.map((c) => c.maxX));
    let bMinY = Math.min(...cluster.map((c) => c.minY));
    let bMaxY = Math.max(...cluster.map((c) => c.maxY));

    // Berikan ruang padding napas (18px pada skala kerja)
    const pad = 18;
    bMinX = Math.max(0, bMinX - pad);
    bMinY = Math.max(0, bMinY - pad);
    bMaxX = Math.min(anaW - 1, bMaxX + pad);
    bMaxY = Math.min(anaH - 1, bMaxY + pad);

    // Petakan kembali ke koordinat penuh resolusi asli kamera (High-DPI)
    const cropX = Math.max(0, Math.floor(bMinX / scale));
    const cropY = Math.max(0, Math.floor(bMinY / scale));
    const cropW = Math.min(rawW - cropX, Math.ceil((bMaxX - bMinX + 1) / scale));
    const cropH = Math.min(rawH - cropY, Math.ceil((bMaxY - bMinY + 1) / scale));

    return { cropX, cropY, cropW, cropH };
}

/**
 * Memangkas margin kosong transparan (Auto-Trim Bounding Box) secara cerdas.
 * Mengabaikan piksel debu soliter (< 2 piksel per lajur) agar kotak potong tidak melar.
 * 
 * @param {HTMLCanvasElement} canvas
 * @param {number} [padding=10]
 * @returns {HTMLCanvasElement}
 */
export function autoTrimCanvas(canvas, padding = 10) {
    const width = canvas.width;
    const height = canvas.height;
    if (width === 0 || height === 0) return canvas;

    const ctx = canvas.getContext('2d');
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;

    const rowInkCount = new Uint32Array(height);
    const colInkCount = new Uint32Array(width);

    for (let y = 0; y < height; y++) {
        const row = y * width;
        for (let x = 0; x < width; x++) {
            if (data[(row + x) * 4 + 3] > 60) {
                rowInkCount[y]++;
                colInkCount[x]++;
            }
        }
    }

    let minY = 0;
    while (minY < height && rowInkCount[minY] < 2) minY++;

    let maxY = height - 1;
    while (maxY >= 0 && rowInkCount[maxY] < 2) maxY--;

    let minX = 0;
    while (minX < width && colInkCount[minX] < 2) minX++;

    let maxX = width - 1;
    while (maxX >= 0 && colInkCount[maxX] < 2) maxX--;

    if (minX > maxX || minY > maxY) {
        return canvas;
    }

    const trimmedX = Math.max(0, minX - padding);
    const trimmedY = Math.max(0, minY - padding);
    const trimmedW = Math.min(width - trimmedX, (maxX - minX + 1) + padding * 2);
    const trimmedH = Math.min(height - trimmedY, (maxY - minY + 1) + padding * 2);

    if (trimmedW <= 0 || trimmedH <= 0) return canvas;

    const trimmedCanvas = document.createElement('canvas');
    trimmedCanvas.width = trimmedW;
    trimmedCanvas.height = trimmedH;
    trimmedCanvas.getContext('2d').drawImage(
        canvas,
        trimmedX, trimmedY, trimmedW, trimmedH,
        0, 0, trimmedW, trimmedH
    );

    return trimmedCanvas;
}

/**
 * Mengonversi elemen Canvas ke objek File (image/png) siap upload.
 * @param {HTMLCanvasElement} canvas
 * @param {string} [filename='tanda_tangan_basah.png']
 * @returns {Promise<File>}
 */
export function canvasToFile(canvas, filename = 'tanda_tangan_basah.png') {
    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (!blob) {
                reject(new Error('Gagal mengekspor canvas ke Blob file.'));
                return;
            }
            const file = new File([blob], filename, {
                type: 'image/png',
                lastModified: Date.now(),
            });
            resolve(file);
        }, 'image/png');
    });
}

/**
 * Peningkatan warna tinta agar pekat, tegas, dan tajam (tack-sharp).
 */
function enhanceCrispInk(data, index, r, g, b, isBlue) {
    if (isBlue) {
        // Biru Pulpen Resmi Berwibawa (#1d4ed8 / #1e3a8a)
        data[index] = Math.max(0, Math.min(30, Math.round(r * 0.15)));
        data[index + 1] = Math.max(0, Math.min(65, Math.round(g * 0.35)));
        data[index + 2] = Math.max(145, Math.min(225, Math.round(b * 1.35)));
    } else {
        // Hitam Pekat Dokumen Resmi (#0f172a / #000000)
        const avg = (r + g + b) / 3;
        const dark = Math.max(0, Math.min(25, Math.round(avg * 0.3) - 25));
        data[index] = dark;
        data[index + 1] = dark;
        data[index + 2] = dark;
    }
}

/**
 * Memproses citra tanda tangan untuk menghapus background kertas (Studio Mode).
 * 
 * @param {HTMLImageElement|HTMLCanvasElement} sourceImage
 * @param {Object} options
 * @returns {HTMLCanvasElement}
 */
export function processSignatureImage(sourceImage, options = {}) {
    const {
        threshold = 205,
        darkness = 1.2,
        colorMode = 'original',
        trim = true,
    } = options;

    const canvas = document.createElement('canvas');
    canvas.width = sourceImage.naturalWidth || sourceImage.width;
    canvas.height = sourceImage.naturalHeight || sourceImage.height;

    if (canvas.width === 0 || canvas.height === 0) return canvas;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(sourceImage, 0, 0);

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    const transitionRange = 18;
    const lowerBound = Math.max(0, threshold - transitionRange);

    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;

        if (lum >= threshold) {
            data[i + 3] = 0;
        } else if (lum <= lowerBound) {
            data[i + 3] = 255;
            adjustStudioInkColor(data, i, r, g, b, darkness, colorMode);
        } else {
            const ratio = (threshold - lum) / transitionRange;
            data[i + 3] = Math.min(255, Math.max(0, Math.round(ratio * 255)));
            adjustStudioInkColor(data, i, r, g, b, darkness, colorMode);
        }
    }

    ctx.putImageData(imgData, 0, 0);
    return trim ? autoTrimCanvas(canvas) : canvas;
}

function adjustStudioInkColor(data, index, r, g, b, darkness, mode) {
    if (mode === 'black') {
        const avg = (r + g + b) / 3;
        const darkened = Math.max(0, Math.min(30, Math.floor(avg / (darkness * 2))));
        data[index] = darkened;
        data[index + 1] = darkened;
        data[index + 2] = darkened;
    } else if (mode === 'blue') {
        data[index] = Math.max(0, Math.min(30, Math.floor(r * 0.2)));
        data[index + 1] = Math.max(0, Math.min(65, Math.floor(g * 0.4)));
        data[index + 2] = Math.max(140, Math.min(220, Math.floor(b * 1.2 * darkness)));
    } else {
        data[index] = Math.max(0, Math.min(255, Math.floor(r / darkness)));
        data[index + 1] = Math.max(0, Math.min(255, Math.floor(g / darkness)));
        data[index + 2] = Math.max(0, Math.min(255, Math.floor(b / darkness)));
    }
}

/**
 * -------------------------------------------------------------------------
 * SISTEM EKSTRAKSI TANDA TANGAN OTOMATIS: autoExtractSignature (V4 Ultra-Crisp & Accurate)
 * -------------------------------------------------------------------------
 * 1. Menemukan area tanda tangan murni secara topologis (Connected Components).
 * 2. Menyaring garis vertikal tepi (border tabel/kertas) dan garis bawah underline.
 * 3. Memotong HANYA tanda tangan langsung dari resolusi kamera asli (Native Resolution).
 * 4. Normalisasi iluminasi lokal (grid-based): latar kertas 100% transparan tanpa bintik noise.
 * 5. Menghasilkan guratan tinta tajam (*tack-sharp*), proporsi natural, dan siap pakai.
 * 
 * @param {File|Blob|string|HTMLImageElement} source
 * @returns {Promise<{ file: File, previewUrl: string, width: number, height: number, isBlueInk: boolean }>}
 */
export async function autoExtractSignature(source) {
    // 1. Muat gambar pada resolusi penuh asli (Native Resolution)
    const img = source instanceof HTMLImageElement ? source : await loadImage(source);
    const rawW = img.naturalWidth || img.width;
    const rawH = img.naturalHeight || img.height;

    // 2. Periksa jika gambar sudah merupakan PNG transparan jadi
    const quickCanvas = document.createElement('canvas');
    quickCanvas.width = Math.min(rawW, 300);
    quickCanvas.height = Math.min(rawH, 300);
    const qCtx = quickCanvas.getContext('2d');
    qCtx.drawImage(img, 0, 0, quickCanvas.width, quickCanvas.height);
    const qData = qCtx.getImageData(0, 0, quickCanvas.width, quickCanvas.height).data;
    let transparentCount = 0;
    for (let i = 3; i < qData.length; i += 4) {
        if (qData[i] < 128) transparentCount++;
    }
    if (transparentCount > (qData.length / 4) * 0.05) {
        const fullCanvas = document.createElement('canvas');
        fullCanvas.width = rawW;
        fullCanvas.height = rawH;
        fullCanvas.getContext('2d').drawImage(img, 0, 0);
        const trimmed = autoTrimCanvas(fullCanvas, 8);
        const file = await canvasToFile(trimmed, 'ttd_basah_asli.png');
        return {
            file,
            previewUrl: trimmed.toDataURL('image/png'),
            width: trimmed.width,
            height: trimmed.height,
            isBlueInk: false,
        };
    }

    // 3. Tentukan Bounding Box Presisi Bebas Garis Tepi & Bayangan Meja
    const { cropX, cropY, cropW, cropH } = findAccurateSignatureBounds(img);

    // 4. Potong langsung dari resolusi kamera asli (Menjaga ketajaman 100%, anti blur)
    const cropCanvas = document.createElement('canvas');
    cropCanvas.width = cropW;
    cropCanvas.height = cropH;
    const cropCtx = cropCanvas.getContext('2d', { willReadFrequently: true });
    cropCtx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);

    const cropImgData = cropCtx.getImageData(0, 0, cropW, cropH);
    const cData = cropImgData.data;

    // 5. Normalisasi kecerahan latar kertas pada area potongan (Grid-Based Local Luminance)
    const getLocalPaper = buildLocalPaperEstimator(cData, cropW, cropH, 24);

    // 6. Deteksi warna tinta pulpen biru vs hitam
    let blueCount = 0;
    let darkCount = 0;
    for (let y = 0; y < cropH; y += 2) {
        const row = y * cropW;
        for (let x = 0; x < cropW; x += 2) {
            const i = (row + x) * 4;
            const r = cData[i];
            const g = cData[i + 1];
            const b = cData[i + 2];
            const lum = 0.299 * r + 0.587 * g + 0.114 * b;
            const bg = getLocalPaper(x, y);

            if (bg - lum >= 30) {
                darkCount++;
                if (b > r + 15 && b > g + 10) {
                    blueCount++;
                }
            }
        }
    }
    const isBlueInk = darkCount > 0 && blueCount > darkCount * 0.16;

    // 7. Binarisasi Tajam & Anti-Aliasing Mikro (Bersih 100% dari bintik abu/noise)
    const transitionRange = 10; // Rentang transisi ketat 10 unit untuk ketajaman guratan

    for (let y = 0; y < cropH; y++) {
        const row = y * cropW;
        for (let x = 0; x < cropW; x++) {
            const i = (row + x) * 4;
            const r = cData[i];
            const g = cData[i + 1];
            const b = cData[i + 2];
            const lum = 0.299 * r + 0.587 * g + 0.114 * b;
            const bg = getLocalPaper(x, y);

            // Ambang batas relatif adaptif terhadap kecerahan kertas lokal
            const cutOff = bg - 28;

            if (lum >= cutOff) {
                // Kertas: 100% PURE TRANSPARENT
                cData[i + 3] = 0;
            } else if (lum <= cutOff - transitionRange) {
                // Tinta solid pekat
                cData[i + 3] = 255;
                enhanceCrispInk(cData, i, r, g, b, isBlueInk);
            } else {
                // Tepi antialiasing mikro tajam (tidak blur)
                const ratio = (cutOff - lum) / transitionRange;
                cData[i + 3] = Math.min(255, Math.max(0, Math.round(ratio * 255)));
                enhanceCrispInk(cData, i, r, g, b, isBlueInk);
            }
        }
    }

    cropCtx.putImageData(cropImgData, 0, 0);

    // 8. Pemangkasan akhir batas transparan rapi dengan autoTrimCanvas
    const finalCanvas = autoTrimCanvas(cropCanvas, 10);
    const cleanFile = await canvasToFile(finalCanvas, 'ttd_basah_tajam.png');

    return {
        file: cleanFile,
        previewUrl: finalCanvas.toDataURL('image/png'),
        width: finalCanvas.width,
        height: finalCanvas.height,
        isBlueInk,
    };
}
