<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Config;

class MigrateToMysql extends Command
{
    protected $signature = 'sikatar:migrate-mysql {--host=127.0.0.1} {--port=3306} {--db=sikatar_db} {--user=root} {--pass=}';
    protected $description = 'Migrate schema and populate data to MySQL database automatically.';

    public function handle()
    {
        $host = $this->option('host');
        $port = $this->option('port');
        $dbName = $this->option('db');
        $user = $this->option('user');
        $pass = $this->option('pass') ?? '';

        $this->info("Target MySQL Database: {$dbName} on {$host}:{$port}");

        try {
            // Test connection to MySQL server
            $pdo = new \PDO("mysql:host={$host};port={$port}", $user, $pass);
            $pdo->exec("CREATE DATABASE IF NOT EXISTS `{$dbName}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;");
            $this->info("Database `{$dbName}` checked/created successfully.");
        } catch (\Exception $e) {
            $this->error("Failed to connect to MySQL server: " . $e->getMessage());
            $this->line("Please make sure MySQL service (XAMPP/Laragon/MySQL) is running.");
            return 1;
        }

        // Dynamically configure MySQL connection
        Config::set('database.connections.mysql.host', $host);
        Config::set('database.connections.mysql.port', $port);
        Config::set('database.connections.mysql.database', $dbName);
        Config::set('database.connections.mysql.username', $user);
        Config::set('database.connections.mysql.password', $pass);
        Config::set('database.default', 'mysql');

        $this->info("Running migrations on MySQL...");
        $this->call('migrate:fresh', [
            '--database' => 'mysql',
            '--force' => true,
        ]);

        $this->info("Seeding data into MySQL (896 Schools, 12k+ Employees, Users, Templates, Applications)...");
        $this->call('db:seed', [
            '--database' => 'mysql',
            '--force' => true,
        ]);

        $this->info("Migration to MySQL completed successfully!");
        $this->line("You can update DB_CONNECTION=mysql in your .env file.");
        return 0;
    }
}
