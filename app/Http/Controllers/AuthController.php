<?php
namespace App\Http\Controllers;

use App\Exceptions\UserAlertException;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function __construct()
    {
        $this->initializeUserSessionContext();
    }

    /**
     * Function checkLogin
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function checkLogin(Request $request): \Illuminate\Http\JsonResponse
    {
        $token = $request->bearerToken();
        if ($token) {
            $user = Auth::guard('api')->user();
            if ($user) {
                if ($request->session()->has('user_id')) {
                    return response()->json([
                                                'status'  => true,
                                                'message' => 'User is authenticated and has an active session.',
                                                'user'    => $user,
                                            ]);
                } else {
                    return response()->json([
                                                'status' => false,
                                                                                                                                                                                                                                                                                                                                    'message' => 'User is authenticated but does not have an active session.',
                                            ], 401);
                }
            } else {
                return response()->json([
                                            'status' => false,
                                                                                                                                                                                                                                                                                                                                'message' => 'Invalid token or user not authenticated.',
                                        ], 401);
            }
        } else {
            return response()->json([
                                        'status' => false,
                                                                                                                                                                                                                                                                                                                            'message' => 'No Bearer token found.',
                                    ], 401);
        }
    }

    /**
     * Function register
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request): \Illuminate\Http\JsonResponse
    {
        try {
            $result = $this->runException(function () use ($request) {
                $validator = Validator::make($request->all(), [
                    'name'     => 'required|string|max:255',
                    'username' => 'required|string|max:255|unique:users',
                    'email'    => 'required|string|email|max:255|unique:users',
                    'password' => 'required|string|min:8|confirmed',
                ]);
                if ($validator->fails()) {
                    throw new UserAlertException("Validation error", 422, $validator->errors(), 'danger');
                }
                $user  = User::create([
                                          'name'       => $request->name,
                                          'username'   => $request->username,
                                          'email'      => $request->email,
                                          'password'   => Hash::make($request->password),
                                          'company_id' => self::getCompanyId() ?? 1,
                                      ]);
                $token = $user->createToken('auth_token')->plainTextToken;

                return $this->getResponse(true, 201, 'User registered successfully', ['token' => $token, 'user' => $user]);
            });

            return response()->json($result)->setStatusCode($result['statusCode']);
        } catch (\Throwable $th) {
            return response()->json($this->getResponse(false, 500, $th->getMessage()))->setStatusCode(500);
        }
    }

    /**
     * Function login
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return \Illuminate\Http\JsonResponse|bool|array
     */
    public function login(Request $request): \Illuminate\Http\JsonResponse | bool | array
    {
        $result = $this->runException(function () use ($request) {
            $validateUser = Validator::make(
                $request->all(),
                [
                                   'username' => 'required',
                                   'password' => 'required'
                               ]
            );
            if ($validateUser->fails()) {
                throw new UserAlertException("validation error", 422, $validateUser->errors(), 'danger');
            }
            if (! Auth::attempt($request->only(['username', 'password']))) {
                throw new UserAlertException("username & Password does not match with our record.", 401, null, 'danger');
            }
            $user = User::where('username', $request->username)->first();
            if (! $user) {
                throw new UserAlertException("User not found", 404, null, 'danger');
            }
            $user->tokens()->delete();
            $user->token = $user->createToken('auth_token')->plainTextToken;

            return $user->getUserSelectedColumns($user);
        });

        return $this->generateResponse($result, "User logged in successfully");
    }
}
