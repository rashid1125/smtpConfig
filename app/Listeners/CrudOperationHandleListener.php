<?php

namespace App\Listeners;

use App\Events\ModelCreated;
use App\Events\ModelDeleted;
use App\Events\ModelUpdated;
use App\Models\CrudOperationHandle;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;

class CrudOperationHandleListener
{
    use InteractsWithQueue;
    public function handle($event)
    {
        if ($event instanceof ModelCreated) {
            $this->handleModelCreated($event->model);
        } elseif ($event instanceof ModelUpdated) {
            $this->handleModelUpdated($event->model);
        } elseif ($event instanceof ModelDeleted) {
            $this->handleModelDeleted($event->model);
        }
    }
    private function handleModelCreated($data)
    {
        Log::info('ModelCreated event handled');
        $this->createModelData($data, 'Insert');
    }

    private function handleModelUpdated($data)
    {
        Log::info('ModelUpdated event handled');
        $this->createModelData($data, 'Update');
    }

    private function handleModelDeleted($data)
    {
        Log::info('ModelDeleted event handled');
        $this->createModelData($data, 'Delete');
    }

    private function createModelData($data, $modelAction)
    {


        $model         = $data;
        $userSessionId = Session::getId();
        $tableName     = $model->getTable();
        $modelData     = $model->toArray();
        $userId        = Auth::id();
        $postDate      = now();

        $crudData = [
            'user_session_id'   => $userSessionId,
            'table_name'        => $tableName,
            'vrnoa'             => isset($modelData['vrnoa']) ? $modelData['vrnoa'] : $modelData['id'],
            'etype'             => $tableName,
            'financial_year_id' => $modelData['fn_id'],
            'company_id'        => $modelData['company_id'],
            'model_data'        => json_encode($modelData),
            'user_id'           => $userId,
            'post_date'         => $postDate,
            'action'            => $modelAction,
        ];
        CrudOperationHandle::create($crudData);
    }
}
