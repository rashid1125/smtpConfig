<?php
/**
 * File DetailTableDataHandlerTrait
 *
 * @package   App\Traits
 *
 * @author    Rashid Rasheed <rashidrasheed1125@gmail.com>
 *
 * @copyright Shahid & Rashid (SR)
 * @version   1.0
 */
declare(strict_types = 1);
namespace App\Traits;

use Illuminate\Database\Eloquent\Model;

trait DetailTableDataHandlerTrait
{
    /**
     * Function saveDetails
     *
     * @param \Illuminate\Database\Eloquent\Model $parentModel
     * @param string                              $detailModelClass
     * @param array                               $detailsData
     * @param string                              $relationshipMethod
     *
     * @return bool
     */
    public function saveDetails(Model $parentModel, string $detailModelClass, array $detailsData, string $relationshipMethod): bool
    {
        if (empty($detailsData)) {
            return false;
        }
        $detailModels = [];
        foreach ($detailsData as $detailAttributes) {
            $detailInstance = new $detailModelClass();
            $detailInstance->fill($detailAttributes);
            $detailModels[] = $detailInstance;
        }
        if (! empty($detailModels)) {
            $relationshipInstance = $parentModel->$relationshipMethod();
            if (method_exists($relationshipInstance, 'saveMany')) {
                $relationshipInstance->saveMany($detailModels);

                return true;
            } else {
                return false;
            }
        }

        return false;
    }
}
