<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\Process\Exception\ProcessFailedException;
use Symfony\Component\Process\Process;

class DbBackupCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'db:backup {--enc=1}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Backup Database (Encrypted)';

    protected $process;

    protected $dir = "db_backups";

    protected $path = "";
    protected $path2 = "";

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();

        if (!Storage::disk('local')->exists($this->dir)) {
            Storage::disk('local')->makeDirectory($this->dir); //creates directory
        }

        $this->path = Storage::disk('local')->path($this->dir) . '/' . date('D') . '.sql.enc';
        $this->path2 = Storage::disk('local')->path($this->dir) . '/' . date('Y-m-d-H-i-s') . '.sql.gzip';
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        try {

            $encoded = $this->option('enc');

            $this->process = $this->getProcess($encoded);

            $this->process->mustRun();

            if (!$this->process->isSuccessful()) {
                throw new ProcessFailedException($this->process);
            }

            $this->info('The backup has been proceed successfully.');
        }
        catch (ProcessFailedException $exception) {
            $this->error('The backup process has been failed.' . $exception->getMessage());
        }
    }

    private function getProcess($encoded)
    {
        $enc = '| openssl  enc -aes-256-cbc -k '.env('APP_KEY');
        $path = $this->path;
        if($encoded == '0')
        {
            $enc = '';
            $path = $this->path2;
        }
        $this->info(' backing up db to ' . $path);

        return Process::fromShellCommandline(sprintf(
            '%s -h%s -u%s -p%s %s --single-transaction --triggers --routines | gzip '. $enc .' > %s',
            env('DB_MYSQLDUMP_PATH'),
            env('DB_HOST'),
            env('DB_USERNAME'),
            env('DB_PASSWORD'),
            env('DB_DATABASE'),
            $path
        ));
    }
}
