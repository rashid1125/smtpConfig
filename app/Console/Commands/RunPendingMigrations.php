<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;

class RunPendingMigrations extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'migrate:pending';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Run pending migrations';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        // Get the list of migration files from the Laravel project
        $migrationFiles = scandir(database_path('migrations'));

        // Get the list of migrations that have been run from the database
        $ranMigrations = DB::table('migrations')->pluck('migration')->toArray();

        // Find the pending migrations
        $pendingMigrations = array_diff($migrationFiles, $ranMigrations);

        // If there are pending migrations, run them
        if (!empty($pendingMigrations)) {
            foreach ($pendingMigrations as $migration) {
                // Run the pending migration
                Artisan::call('migrate', ['--path' => "database/migrations/$migration"]);
                $this->info("Migration $migration executed successfully.");
            }
        } else {
            $this->info('No pending migrations found.');
        }

        return 0;
    }
}