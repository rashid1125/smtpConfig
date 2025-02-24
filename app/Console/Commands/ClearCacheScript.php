<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class ClearCacheScript extends Command
{
    protected $signature = 'clear:cache-script';
    protected $description = 'Run the appropriate shell script for cache clearing based on the operating system';

    public function __construct()
    {
        parent::__construct();
    }

    public function handle()
    {
        $this->info('Environment Variable: ' . env('RUN_CACHE_CLEAR_SCRIPT', 'not set'));

        if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
            // Windows script path
            $scriptPath = base_path('app_cache_clear.bat'); // Make sure to have a .bat or .ps1 script for Windows
            $this->info("Windows script path: {$scriptPath}");
        } else {
            // Unix/Linux script path (for CentOS)
            $scriptPath = base_path('app_cache_clear.sh');
            $this->info("Unix/Linux script path: {$scriptPath}");
        }

        if (file_exists($scriptPath)) {
            $this->info("The script file exists.");
            $output = $this->runScript($scriptPath);
            $this->info($output ?: 'No output from script.');
        } else {
            $this->info("The script file does not exist.");
        }
    }

    protected function runScript($scriptPath)
    {
        if (env('RUN_CACHE_CLEAR_SCRIPT', false)) {
            if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
                // Assuming .bat script for simplicity; adjust if using PowerShell or other
                $command = "cmd /c {$scriptPath}";
            } else {
                // Unix/Linux execution
                $command = "bash {$scriptPath}";
            }
            return shell_exec($command . " 2>&1");
        } else {
            return 'Cache clear script execution is disabled in the environment.';
        }
    }
}
