<x-transaction-form-header :title="$title"/>
<div class="row" id="main-content">
    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <div class="row mt-5">
            <div class="col">
                <x-card.card class="shadow-lg h-100">
                    <x-card.card-header>
                        <div class="card-tools">
                            <button type="button" class="btn btn-tool" id="emailSyncAlt">
                                <i class="fas fa-sync-alt"></i>
                            </button>
                            <button type="button" class="btn btn-tool" data-toggle="modal" id="emailModalShow">
                                <i class="fas fa-plus"></i>
                            </button>
                            <button type="button" class="btn btn-tool" data-card-widget="remove">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </x-card.card-header>
                    <x-card.card-body>
                        <div class="row mt-2">
                            <div class="col-lg-12">
                                <x-table.table-component id="emailViewList" class="table table-bordered text-md">
                                    <x-table.table-head>
                                        <x-table.table-row>
                                            <x-table.table-header-cell>Sr#</x-table.table-header-cell>
                                            <x-table.table-header-cell>Protocol</x-table.table-header-cell>
                                            <x-table.table-header-cell>Hots</x-table.table-header-cell>
                                            <x-table.table-header-cell>Port</x-table.table-header-cell>
                                            <x-table.table-header-cell>Username</x-table.table-header-cell>
                                            <x-table.table-header-cell>Password</x-table.table-header-cell>
                                            <x-table.table-header-cell>From Email</x-table.table-header-cell>
                                            <x-table.table-header-cell-right>Action</x-table.table-header-cell-right>
                                        </x-table.table-row>
                                    </x-table.table-head>
                                    <tbody id="emailViewListTbody">

                                    </tbody>
                                </x-table.table-component>
                            </div>
                        </div>
                    </x-card.card-body>
                </x-card.card>
            </div>
        </div>
    </div>
</div>
<x-modal.dynamic-modal modalId="emailAddModalId" modalSize="modal-lg" title="Add New Email">
    <input type="hidden" id="emailHiddenId">
    <div class="row">
        <div class="col">
            <x-card.card class="shadow-lg h-100">
                <x-card.card-body>
                    <x-row>
                        <x-col class="col-sm-12">
                            <div class="row">
                                <label for="emailProtocol" class="col-sm-4 col-form-label text-md-end">Protocol
                                    <sub class="asterisk"><i class="fa fa-asterisk"></i></sub>
                                </label>
                                <div class="col-sm-8">
                                    <x-input type="text" id="emailProtocol" data-toggle="tooltip" data-title="Email Protocol" placeholder="Email Protocol"/>
                                </div>
                            </div>
                        </x-col>
                    </x-row>
                    <x-row>
                        <x-col class="col-sm-12">
                            <div class="row">
                                <label for="emailHost" class="col-sm-4 col-form-label text-md-end">Host
                                    <sub class="asterisk"><i class="fa fa-asterisk"></i></sub>
                                </label>
                                <div class="col-sm-8">
                                    <x-input type="text" id="emailHost" data-toggle="tooltip" data-title="Email Host" placeholder="Email Host"/>
                                </div>
                            </div>
                        </x-col>
                    </x-row>
                    <x-row>
                        <x-col class="col-sm-12">
                            <div class="row">
                                <label for="emailPort" class="col-sm-4 col-form-label text-md-end">Port
                                    <sub class="asterisk"><i class="fa fa-asterisk"></i></sub>
                                </label>
                                <div class="col-sm-8">
                                    <x-input type="text" id="emailPort" data-toggle="tooltip" data-title="Email Port" placeholder="Email Port"/>
                                </div>
                            </div>
                        </x-col>
                    </x-row>
                    <x-row>
                        <x-col class="col-sm-12">
                            <div class="row">
                                <label for="emailUsername" class="col-sm-4 col-form-label text-md-end">Username
                                    <sub class="asterisk"><i class="fa fa-asterisk"></i></sub>
                                </label>
                                <div class="col-sm-8">
                                    <x-input type="text" id="emailUsername" data-toggle="tooltip" data-title="Email Username" placeholder="Email Username"/>
                                </div>
                            </div>
                        </x-col>
                    </x-row>
                    <x-row>
                        <x-col class="col-sm-12">
                            <div class="row">
                                <label for="emailPassword" class="col-sm-4 col-form-label text-md-end">Password
                                    <sub class="asterisk"><i class="fa fa-asterisk"></i></sub>
                                </label>
                                <div class="col-sm-8">
                                    <x-input type="password" id="emailPassword" data-toggle="tooltip" data-title="Email Password" placeholder="Email Password"/>
                                </div>
                            </div>
                        </x-col>
                    </x-row>
                    <x-row>
                        <x-col class="col-sm-12">
                            <div class="row">
                                <label for="emailFromEmail" class="col-sm-4 col-form-label text-md-end">From Email
                                    <sub class="asterisk"><i class="fa fa-asterisk"></i></sub>
                                </label>
                                <div class="col-sm-8">
                                    <x-input type="text" id="emailFromEmail" data-toggle="tooltip" data-title="Email From Email" placeholder="Email From Email"/>
                                </div>
                            </div>
                        </x-col>
                    </x-row>
                    <x-row>
                        <x-col class="col-sm-12">
                            <div class="row">
                                <label for="emailDomainList" class="col-sm-4 col-form-label text-md-end">Domain
                                    <sub class="asterisk"><i class="fa fa-asterisk"></i></sub>
                                </label>
                                <div class="col-sm-8">
                                    <select class="form-control select2" id="emailDomainList" data-toggle="tooltip" data-title="Email Domain" multiple>
                                        @if(!empty($domains))
                                            @foreach($domains as $domain)
                                                <option value="{{ $domain->id }}">{{ $domain->name }}</option>
                                            @endforeach
                                        @endif
                                    </select>
                                </div>
                            </div>
                        </x-col>
                    </x-row>
                </x-card.card-body>
                <x-card.card-footer>
                    <button type="button" class="btn btn-outline-warning focus:border-2" id="emailResetButton"><i
                                class="fas fa-sync-alt"></i>
                        Reset F5
                    </button>
                    <button type="button" class="btn btn-outline-success focus:border-2" id="emailSaveButton"><i
                                class="fa fa-save"></i> Save
                        F10
                    </button>
                </x-card.card-footer>
            </x-card.card>
        </div>
    </div>
    <x-slot name="modal-footer">
        <div class="pull-right">
            <a class="btn btn-warning" id="accountLookUpClose" data-dismiss="modal"><i class="fa fa-times"></i>
                Close</a>
        </div>
    </x-slot>
</x-modal.dynamic-modal>
