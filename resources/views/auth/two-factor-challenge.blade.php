@extends('layouts.app')
@section('content')
    <section class="bg-gray-50 dark:bg-gray-900 shadow">
        <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <a href="#" class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                <img class="w-8 h-8 mr-2" src="{{ asset('assets/img/dm.png') }}" alt="logo">
                <b>Digital</b>Manager
            </a>
            <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700"
                x-data="{ recovery: false }">
                <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <div class="mb-4">
                        <div class="alert alert-info" role="alert" x-show="! recovery">
                            {{ __('Please confirm access to your account by entering the authentication code provided by your authenticator application.') }}
                        </div>

                        <div class="alert alert-info" role="alert" x-show="recovery">
                            {{ __('Please confirm access to your account by entering one of your emergency recovery codes.') }}
                        </div>

                    </div>
                    <form method="POST" action="{{ route('two-factor.login') }}">
                        @csrf

                        <div class="mb-4" x-show="! recovery">
                            <label for="code"
                                class="block text-sm font-medium text-gray-700">{{ __('Code') }}</label>
                            <x-input id="code" type="text"
                                class="@error('code') border-red-500 @enderror" name="code"
                                value="{{ old('code') }}" autocomplete="one-time-code" />

                            @error('code')
                                <p class="text-md text-red-500 italic">{{ $message }}</p>
                            @enderror
                        </div>

                        <div class="mb-4" x-show="recovery">
                            <label for="recovery_code"
                                class="block text-sm font-medium text-gray-700">{{ __('Recovery Code') }}</label>
                            <x-input id="recovery_code" type="text"
                                class="@error('recovery_code') border-red-500 @enderror"
                                name="recovery_code" value="{{ old('recovery_code') }}" autocomplete="one-time-code" />

                            @error('recovery_code')
                                <p class="text-red-500 text-md italic">{{ $message }}</p>
                            @enderror
                        </div>

                        <div class="flex items-center justify-end mt-4"></div>

                        <div class="mb-0 flex items-center justify-between">
                            <div class="w-1/3">
                                <button type="submit"
                                    class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                    {{ __('Login') }}
                                </button>
                            </div>

                            <div class="w-2/2">
                                <button type="button" class="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
                                    x-show="! recovery"
                                    x-on:click="recovery = true; $nextTick(() => { $refs.recovery_code.focus() })">
                                    {{ __('Use a recovery code') }}
                                </button>

                                <button type="button" class="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
                                    x-show="recovery"
                                    x-on:click="recovery = false; $nextTick(() => { $refs.code.focus() })">
                                    {{ __('Use an authentication code') }}
                                </button>
                            </div>
                        </div>
                    </form>


                </div>
            </div>
        </div>
    </section>
@endsection
