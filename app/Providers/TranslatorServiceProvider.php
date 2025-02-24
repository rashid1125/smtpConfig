<?php

namespace App\Providers;

use App\Services\TranslatorService;
use Illuminate\Support\ServiceProvider;

class TranslatorServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        $this->app->singleton('translator', function ($app) {
            $loader = $app['translation.loader'];
            $translator = new TranslatorService($loader, $app['config']['app.locale']);
            $translator->setFallback($app['config']['app.fallback_locale']);
            return $translator;
        });
    }
}
