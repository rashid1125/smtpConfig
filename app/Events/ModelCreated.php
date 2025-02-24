<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ModelCreated
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
    public $modelData;
    public $model;
    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(Model $model, $modelData)
    {
        $this->model = $model;
        $this->modelData = $modelData; // Set the model data
        
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new PrivateChannel('channel-name');
    }
}
