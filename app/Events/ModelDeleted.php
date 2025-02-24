<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ModelDeleted
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * The model that has been deleted.
     *
     * @var \Illuminate\Database\Eloquent\Model
     */
    public $modelData;
    public $model;

    /**
     * Create a new event instance.
     *
     * @param  \Illuminate\Database\Eloquent\Model  $model
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
        // Change this if you want to use broadcasting feature,
        // for now, we're just using this event for server-side listeners.
        return new PrivateChannel('channel-name');
    }
}
