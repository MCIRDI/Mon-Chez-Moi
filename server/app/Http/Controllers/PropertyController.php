<?php

namespace App\Http\Controllers;

use App\Models\Favorite;
use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Validation\Rule;

class PropertyController extends Controller
{
    /**
     * Format validation errors into user-friendly messages
     */
    private function formatValidationErrors(array $errors): array
    {
        $formattedErrors = [];
        
        foreach ($errors as $field => $messages) {
            $fieldName = $this->getFieldDisplayName($field);
            foreach ($messages as $message) {
                $formattedErrors[] = [
                    'field' => $fieldName,
                    'message' => $this->formatErrorMessage($message, $fieldName)
                ];
            }
        }
        
        return $formattedErrors;
    }
    
    /**
     * Get display name for validation fields
     */
    private function getFieldDisplayName(string $field): string
    {
        $fieldNames = [
            'photo1' => 'Main Photo',
            'photo2' => 'Second Photo',
            'photo3' => 'Third Photo',
            'rent_or_sale' => 'Rent or Sale',
            'price' => 'Price',
            'state' => 'State',
            'municipality' => 'Municipality',
            'exact_address' => 'Address',
            'number_rooms' => 'Number of Rooms',
            'space' => 'Space (m²)',
            'type' => 'Property Type',
            'floor' => 'Floor',
            'description' => 'Description',
            'features' => 'Features'
        ];
        
        return $fieldNames[$field] ?? ucfirst($field);
    }
    
    /**
     * Format error message to be more user-friendly
     */
    private function formatErrorMessage(string $message, string $fieldName): string
    {
        // Replace field names with display names
        $message = str_replace([
            'photo1', 'photo2', 'photo3',
            'rent or sale', 'price', 'state', 'municipality',
            'exact address', 'number rooms', 'space', 'type', 'floor', 'description'
        ], [
            'main photo', 'second photo', 'third photo',
            'rent or sale option', 'price', 'state', 'municipality',
            'address', 'number of rooms', 'space', 'property type', 'floor', 'description'
        ], $message);
        
        // Add file size information for photo errors
        if (strpos($message, 'photo') !== false && strpos($message, 'max') !== false) {
            $message .= ' (Maximum file size is 10MB)';
        }
        
        return ucfirst($message);
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try{
            $properties = Property::all();
            return response()->json($properties);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred while retrieving properties',
                'error' => $e->getMessage(),
            ], 500);
    }
    }
public function  myProperties(){
    try{
$user_id= auth()->id();
$properties=Property::where('id_user',$user_id)->get();
return response()->json($properties);

    }catch(\Exception $e) {
        return response()->json([
            'message' => 'An error occurred while retrieving properties',
            'error' => $e->getMessage(),
        ], 500);
}
}
    /**
     * Store a newly created resource in storage.
     */

public function store(Request $request)
{
    try {
        if (!auth()->check()) {
            return response()->json([
                'message' => 'You must be logged in to create a property',
            ], 401);
        }

        // Validate input including images
        $validatedData = $request->validate([
            'photo1' => 'required|image|mimes:jpeg,png,jpg,gif|max:10240', // principal (10MB)
            'photo2' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:10240', // secondary (10MB)
            'photo3' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:10240', // secondary (10MB)
            'rent_or_sale' => ['required', Rule::in(['rent', 'sale'])],
            'price' => 'required|numeric|min:0',
            'state' => 'required|string|max:255',
            'municipality' => 'required|string|max:255',
            'exact_address' => 'required|string|max:500',
            'number_rooms' => 'required|integer|min:1',
            'space' => 'required|numeric|min:1',
            'type' => ['required', Rule::in(['House', 'Villa', 'Apartment', 'Shop'])],
            'floor' => 'nullable|integer|min:0',
            'description' => 'nullable|string|max:1000',
            'features' => 'nullable|array',
            'features.*' => 'string|max:30',
        ]);

        // Save uploaded images to storage and store paths
        foreach (['photo1', 'photo2', 'photo3'] as $photoKey) {
            if ($request->hasFile($photoKey)) {
                $validatedData[$photoKey] = $request->file($photoKey)->store('properties', 'public');
            }
        }

        // Attach authenticated user ID
        $validatedData['id_user'] = auth()->id();

        // Create property record
        $property = Property::create($validatedData);

        return response()->json([
            'message' => 'Property successfully registered',
            'data' => $property,
        ], 201);

    } catch (ValidationException $e) {
        return response()->json([
            'message' => 'Validation failed',
            'errors' => $e->errors(),
            'error_details' => $this->formatValidationErrors($e->errors())
        ], 422);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'An error occurred while creating the property',
            'error' => $e->getMessage(),
        ], 500);
    }
}
    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try{
            $property = Property::find($id);
            if(! $property){
                return response()->json([
                    'message' => 'Property not found',
                ], 404);            }
            return response()->json($property);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred while retrieving property',
                'error' => $e->getMessage(),
            ], 500);
    }    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            \Log::info('Update request for property ID: ' . $id);
            \Log::info('Request data: ', $request->all());

            $validatedData = $request->validate([
                'photo1' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:10240',
                'photo2' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:10240',
                'photo3' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:10240',
                  'rent_or_sale' => ['required', Rule::in(['rent', 'sale'])],
                  'price' => 'required|numeric|min:0',
                  'state' => 'required|string|max:255',
                  'municipality' => 'required|string|max:255',
                  'exact_address' => 'required|string|max:500',
                  'number_rooms' => 'required|integer|min:1',
                  'space' => 'required|numeric|min:1',
                  'type' => ['required', Rule::in(['House', 'Villa', 'Apartment', 'Shop'])],
                  'floor' => 'nullable|integer|min:0',
                  'description' => 'nullable|string|max:1000',
                  'features' => 'nullable|array',
                  'features.*' => 'string|max:30', // Each item in the array must be a string of max 255 characters
              ]);
          $property= Property::find($id);
           if(! $property){
            return response()->json([
                'message' => 'Property not found',
            ], 404);
           }

           if( $property->id_user !== auth()->id()){
            return response()->json([
                'message' => 'You are not authorized to update this property',
            ], 403); // 403 Forbidden
           }

        // Save uploaded images to storage and store paths
        foreach (['photo1', 'photo2', 'photo3'] as $photoKey) {
            if ($request->hasFile($photoKey)) {
                $validatedData[$photoKey] = $request->file($photoKey)->store('properties', 'public');
            }
        }

        \Log::info('Validated data: ', $validatedData);
        
        $property->update($validatedData);
        \Log::info('Property updated successfully');

        return response()->json([
            'message' => 'Property successfully updated',
            'data' => $property,
        ], 200); // 200 OK

    } catch (ValidationException $e) {
        \Log::error('Validation error: ' . json_encode($e->errors()));
        return response()->json([
            'message' => 'Validation failed',
            'errors' => $e->errors(),
            'error_details' => $this->formatValidationErrors($e->errors())
        ], 422);
    } catch (\Exception $e) {
        \Log::error('Update error: ' . $e->getMessage());
        return response()->json([
            'message' => 'An error occurred while  updating the property',
            'error' => $e->getMessage(),
        ], 500); // 500 Internal Server Error
    }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try{
            $property=Property::find($id);
            if (!$property) {
                return response()->json(['message' => 'Property not found'], 404);
            }
            if($property->id_user !== auth()->id()){
                return   response()->json(['message'=>'You are not authorized to delete this property'],403);// 403 Forbidden
           }
           $property->delete();
           return response()->json(['message' => 'Property deleted successfully'], 200);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'An error occurred while deleting the property',
            'error' => $e->getMessage(),
        ], 500); // 500 Internal Server Error
    }
    }

    public function getFilteredProperties(Request $request){

    try{
        $query= Property::query();
        if($request->filled('price')){
            $priceRange = $request->price;
            if (is_string($priceRange)) {
                $priceRange = json_decode($priceRange, true);
            }
            $query->whereBetween('price',[$priceRange[0], $priceRange[1]]);
        }
        if($request->filled('rent_or_sale')){
            $query->where('rent_or_sale',$request->rent_or_sale);
        }
        if($request->filled('state')){
            $query->where('state',$request->state);
        }

        if($request->filled('type')){


            $query->where('type',$request->type);
        }
        $properties=$query->get();
        return response()->json($properties);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'An error occurred while retrieving properties',
            'error' => $e->getMessage(),
        ], 500);

    }
    }



     public function getUserFavorites()
    {
        $userId = auth()->id();
        if (!$userId) {
            return response()->json([
                'message' => 'You must be logged in to see favorites.'
            ], 401);
        }

        $favorites = Favorite::with('property')
            ->where('id_user', $userId)
            ->get();

        return response()->json([
            'favorites' => $favorites
        ]);
    }


public function storeFavorites(Request $request)
{
    $userId = auth()->id();

    if (!$userId) {
        return response()->json([
            'message' => 'You must be logged in to save favorites.'
        ], 401);
    }

    $validated = $request->validate([
        'id_property' => 'required|exists:properties,id',
    ]);

    $favorite = Favorite::firstOrCreate(
        [
            'id_user' => $userId,
            'id_property' => $validated['id_property'],
        ]
    );

    return response()->json([
        'message' => $favorite->wasRecentlyCreated
            ? 'Property added to favorites successfully.'
            : 'This property is already in your favorites.',
        'favorite' => $favorite
    ], $favorite->wasRecentlyCreated ? 201 : 200);
}
public function removeFromFavorites($id)
{
    $userId = auth()->id();

    if (!$userId) {
        return response()->json([
            'message' => 'You must be logged in to remove favorites.'
        ], 401);
    }

    $favorite = Favorite::where('id_user', $userId)
        ->where('id_property', $id)
        ->first();

    if (!$favorite) {
        return response()->json([
            'message' => 'This property is not in your favorites.'
        ], 404);
    }

    $favorite->delete();

    return response()->json([
        'message' => 'Property removed from favorites successfully.'
    ], 200);
}
}
