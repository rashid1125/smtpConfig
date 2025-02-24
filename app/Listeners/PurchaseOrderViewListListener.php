<?php

namespace App\Listeners;

use App\Events\PurchaseOrderViewListEvent;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class  PurchaseOrderViewListListener implements ShouldQueue
{
    use InteractsWithQueue;
     /**
     * Handle the event.
     *
     * @param  \App\Events\PurchaseOrderViewListEvent  $event
     * @return void
     */
    public function handle(PurchaseOrderViewListEvent $event)
    {
       return $event;
    }
}
