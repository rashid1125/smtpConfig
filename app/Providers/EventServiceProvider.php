<?php

namespace App\Providers;

use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event listener mappings for the application.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        Registered::class => [
            SendEmailVerificationNotification::class,
        ],
        \App\Events\ModelCreated::class => [
            \App\Listeners\CrudOperationHandleListener::class,
        ],
        \App\Events\ModelUpdated::class => [
            \App\Listeners\CrudOperationHandleListener::class,
        ],
        \App\Events\ModelDeleted::class => [
            \App\Listeners\CrudOperationHandleListener::class,
        ],
        \App\Events\PurchaseOrderViewListEvent::class => [
            \App\Listeners\PurchaseOrderViewListListener::class,
        ],
        \App\Events\ReportDynamicallyInserted::class => [
            \App\Listeners\CreateReportProcedure::class,
        ],
    ];

    /**
     * Register any events for your application.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
