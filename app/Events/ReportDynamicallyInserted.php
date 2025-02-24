<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ReportDynamicallyInserted
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
    public $procedure_name;
    public $report_id;
    /**
     * Create a new event instance.
     * @param string $procedure_name
     * @param int $report_id
     * @return void
     */
    public function __construct(string $procedure_name, int $report_id)
    {
        $this->procedure_name = $procedure_name;
        $this->report_id      = $report_id;
    }
}
