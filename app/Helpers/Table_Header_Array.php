<?php
function handleTableHeader($tableType)
{
  $tableHeader = [];
  if ($tableType === "itemLookUp") {
    $tableHeader = [
      ['content' => '#', 'class' => 'py-2 px-2 text-md'],
      ['content' => 'Item Type', 'class' => 'py-2 px-2 text-md'],
      ['content' => 'Category', 'class' => 'py-2 px-2 text-md'],
      ['content' => 'Sub Category', 'class' => 'py-2 px-2 text-md'],
      ['content' => 'Brand', 'class' => 'py-2 px-2 text-md'],
      ['content' => 'Description', 'class' => 'py-2 px-2 text-md'],
      ['content' => 'Cost Rate', 'class' => 'py-2 px-2 text-md text-right'],
      ['content' => 'Retail Rate', 'class' => 'py-2 px-2 text-md text-right'],
      ['content' => 'Action', 'class' => 'py-2 px-2 text-md']
    ];
  }
  return $tableHeader;
}
