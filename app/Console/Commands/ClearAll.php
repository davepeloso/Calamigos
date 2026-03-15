<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;

class ClearAll extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'clear';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clear all Laravel caches (application, config, routes, views) and regenerate autoload';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Clearing all Laravel caches...');

        $commands = [
            'cache:clear' => 'Application cache',
            'config:clear' => 'Configuration cache',
            'route:clear' => 'Route cache',
            'view:clear' => 'Compiled views',
        ];

        foreach ($commands as $command => $description) {
            $this->info("Clearing {$description}...");
            Artisan::call($command);
            $this->line("✓ {$description} cleared");
        }

        $this->info('Regenerating composer autoload...');
        shell_exec('composer dump-autoload 2>&1');
        $this->line('✓ Composer autoload regenerated');
        
        $this->newLine();
        $this->info('🎉 All caches cleared successfully!');
        $this->info('Your Laravel application is now completely refreshed.');
    }
}
