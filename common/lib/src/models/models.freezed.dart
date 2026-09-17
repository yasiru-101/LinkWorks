// GENERATED FILE: change common/lib/src/models/models.dart instead.
// Regenerate from common/ using dart run build_runner build. Manual changes here are overwritten.

// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint, type=warning, deprecated_member_use, deprecated_member_use_from_same_package
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

// Explains: Attach generated declarations to models.dart so they share its imports and private types.
part of 'models.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// GENERATED CODE - DO NOT MODIFY BY HAND
// dart format off
// Explains: Return a copied model unchanged when generated copyWith needs no further result conversion.
T _$identity<T>(T value) => value;

/// @nodoc
// Explains: Define the generated implementation/interface for the model; fields originate in models.dart.
mixin _$GeoLocation {

 // Explains: Declare/configure lat: latitude in decimal degrees; lng: longitude in decimal degrees; geohash: the spatial prefix used to narrow location searches.
 double get lat; double get lng; String get geohash;
/// Create a copy of GeoLocation
/// with the given fields replaced by the non-null parameter values.
// Explains: Specify the persisted JSON key or whether the following member participates in serialization.
@JsonKey(includeFromJson: false, includeToJson: false)
// Explains: Give the Dart compiler an optimization hint for the following generated helper.
@pragma('vm:prefer-inline')
// Explains: Support immutable copies of this model; unspecified fields retain their current values.
$GeoLocationCopyWith<GeoLocation> get copyWith => _$GeoLocationCopyWithImpl<GeoLocation>(this as GeoLocation, _$identity);

  /// Serializes this GeoLocation to a JSON map.
  // Explains: Expose serialization of this immutable model through its generated field mapper.
  Map<String, dynamic> toJson();


// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override
// Explains: Compare model values instead of requiring both references to be the same object.
bool operator ==(Object other) {
  // Explains: View this generated mixin as its concrete model before accessing typed fields.
  final _this = this as GeoLocation;
  // Explains: Short-circuit identity matches, then compare the relevant generated model fields for equality.
  return identical(this, other) || (other.runtimeType == runtimeType&&other is GeoLocation&&(identical(other.lat, _this.lat) || other.lat == _this.lat)&&(identical(other.lng, _this.lng) || other.lng == _this.lng)&&(identical(other.geohash, _this.geohash) || other.geohash == _this.geohash));
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Specify the persisted JSON key or whether the following member participates in serialization.
@JsonKey(includeFromJson: false, includeToJson: false)
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override
// Explains: Compute a hash consistent with value equality so models work correctly in sets/maps.
int get hashCode {
  // Explains: View this generated mixin as its concrete model before accessing typed fields.
  final _this = this as GeoLocation;
  // Explains: Compute a hash consistent with value equality so models work correctly in sets/maps.
  return Object.hash(runtimeType,_this.lat,_this.lng,_this.geohash);
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override
// Explains: Produce a readable diagnostic model representation for debugging.
String toString() {
  // Explains: View this generated mixin as its concrete model before accessing typed fields.
  final _this = this as GeoLocation;
  // Explains: Return the formatted model description including its current field values.
  return 'GeoLocation(lat: ${_this.lat}, lng: ${_this.lng}, geohash: ${_this.geohash})';
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}


// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

/// @nodoc
// Explains: Define generated immutable-copy support; change the model source rather than this helper.
abstract mixin class $GeoLocationCopyWith<$Res>  {
  // Explains: Support immutable copies of this model; unspecified fields retain their current values.
  factory $GeoLocationCopyWith(GeoLocation value, $Res Function(GeoLocation) _then) = _$GeoLocationCopyWithImpl;
// Explains: Tell analysis tools that callers should use the returned copied value.
@useResult
// Explains: Declare the generated copyWith call signature and replacement-field arguments.
$Res call({
 // Explains: Declare/configure lat: latitude in decimal degrees; lng: longitude in decimal degrees; geohash: the spatial prefix used to narrow location searches.
 double lat, double lng, String geohash
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
});




// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
/// @nodoc
// Explains: Define generated immutable-copy support; change the model source rather than this helper.
class _$GeoLocationCopyWithImpl<$Res>
    // Explains: Support immutable copies of this model; unspecified fields retain their current values.
    implements $GeoLocationCopyWith<$Res> {
  // Explains: Support immutable copies of this model; unspecified fields retain their current values.
  _$GeoLocationCopyWithImpl(this._self, this._then);

  // Explains: Store the immutable model field or generated copy callback used by the methods below.
  final GeoLocation _self;
  // Explains: Store the callback that converts a copied model into the requested result type.
  final $Res Function(GeoLocation) _then;

/// Create a copy of GeoLocation
/// with the given fields replaced by the non-null parameter values.
// Explains: Give the Dart compiler an optimization hint for the following generated helper.
@pragma('vm:prefer-inline') @override $Res call({Object? lat = null,Object? lng = null,Object? geohash = null,}) {
  // Explains: Pass the newly constructed immutable copy through the generated result callback.
  return _then(GeoLocation(
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
lat: null == lat ? _self.lat : lat // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as double,lng: null == lng ? _self.lng : lng // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as double,geohash: null == geohash ? _self.geohash : geohash // ignore: cast_nullable_to_non_nullable
// Explains: Cast the copied/deserialized value back to the declared field type after null/default handling.
as String,
  // Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
  ));
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}


/// Adds pattern-matching-related methods to [GeoLocation].
// Explains: Group generated callbacks for matching this model variant and choosing a return value.
extension GeoLocationPatterns on GeoLocation {
/// A variant of `map` that fallback to returning `orElse`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

// Explains: Define generated pattern matching whose result type can be inferred by callers.
@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _GeoLocation value)?  $default,{required TResult orElse(),}){
// Explains: Capture the model instance for generated variant dispatch.
final _that = this;
// Explains: Choose the callback matching this generated model variant.
switch (_that) {
// Explains: Handle the matching model variant, or the fallback case when no typed callback applies.
case _GeoLocation() when $default != null:
// Explains: Invoke the callback with the matched model or its destructured fields and return its result.
return $default(_that);case _:
  // Explains: Run the caller fallback because the requested model callback does not apply.
  return orElse();

// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
/// A `switch`-like method, using callbacks.
///
/// Callbacks receives the raw object, upcasted.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case final Subclass2 value:
///     return ...;
/// }
/// ```

// Explains: Define generated pattern matching whose result type can be inferred by callers.
@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _GeoLocation value)  $default,){
// Explains: Capture the model instance for generated variant dispatch.
final _that = this;
// Explains: Choose the callback matching this generated model variant.
switch (_that) {
// Explains: Handle the matching model variant, or the fallback case when no typed callback applies.
case _GeoLocation():
// Explains: Invoke the callback with the matched model or its destructured fields and return its result.
return $default(_that);case _:
  // Explains: Stop this operation with an explicit error because the input or model variant is unsupported.
  throw StateError('Unexpected subclass');

// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
/// A variant of `map` that fallback to returning `null`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return null;
/// }
/// ```

// Explains: Define generated pattern matching whose result type can be inferred by callers.
@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _GeoLocation value)?  $default,){
// Explains: Capture the model instance for generated variant dispatch.
final _that = this;
// Explains: Choose the callback matching this generated model variant.
switch (_that) {
// Explains: Handle the matching model variant, or the fallback case when no typed callback applies.
case _GeoLocation() when $default != null:
// Explains: Invoke the callback with the matched model or its destructured fields and return its result.
return $default(_that);case _:
  // Explains: Return no result/error; callers interpret null according to this method contract.
  return null;

// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
/// A variant of `when` that fallback to an `orElse` callback.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

// Explains: Define generated pattern matching whose result type can be inferred by callers.
@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( double lat,  double lng,  String geohash)?  $default,{required TResult orElse(),}) {final _that = this;
// Explains: Choose the callback matching this generated model variant.
switch (_that) {
// Explains: Handle the matching model variant, or the fallback case when no typed callback applies.
case _GeoLocation() when $default != null:
// Explains: Invoke the callback with the matched model or its destructured fields and return its result.
return $default(_that.lat,_that.lng,_that.geohash);case _:
  // Explains: Run the caller fallback because the requested model callback does not apply.
  return orElse();

// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
/// A `switch`-like method, using callbacks.
///
/// As opposed to `map`, this offers destructuring.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case Subclass2(:final field2):
///     return ...;
/// }
/// ```

// Explains: Define generated pattern matching whose result type can be inferred by callers.
@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( double lat,  double lng,  String geohash)  $default,) {final _that = this;
// Explains: Choose the callback matching this generated model variant.
switch (_that) {
// Explains: Handle the matching model variant, or the fallback case when no typed callback applies.
case _GeoLocation():
// Explains: Invoke the callback with the matched model or its destructured fields and return its result.
return $default(_that.lat,_that.lng,_that.geohash);case _:
  // Explains: Stop this operation with an explicit error because the input or model variant is unsupported.
  throw StateError('Unexpected subclass');

// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
/// A variant of `when` that fallback to returning `null`
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return null;
/// }
/// ```

// Explains: Define generated pattern matching whose result type can be inferred by callers.
@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( double lat,  double lng,  String geohash)?  $default,) {final _that = this;
// Explains: Choose the callback matching this generated model variant.
switch (_that) {
// Explains: Handle the matching model variant, or the fallback case when no typed callback applies.
case _GeoLocation() when $default != null:
// Explains: Invoke the callback with the matched model or its destructured fields and return its result.
return $default(_that.lat,_that.lng,_that.geohash);case _:
  // Explains: Return no result/error; callers interpret null according to this method contract.
  return null;

// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

/// @nodoc
// Explains: Generate the field-to-JSON and JSON-to-field mapping for this concrete immutable model.
@JsonSerializable()

// Explains: Define the generated implementation/interface for the model; fields originate in models.dart.
class _GeoLocation implements GeoLocation {
  // Explains: Declare/configure lat: latitude in decimal degrees; lng: longitude in decimal degrees; geohash: the spatial prefix used to narrow location searches.
  const _GeoLocation({required this.lat, required this.lng, required this.geohash});
  // Explains: Delegate field parsing to the generated JSON deserializer for this model.
  factory _GeoLocation.fromJson(Map<String, dynamic> json) => _$GeoLocationFromJson(json);

// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override final  double lat;
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override final  double lng;
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override final  String geohash;

/// Create a copy of GeoLocation
/// with the given fields replaced by the non-null parameter values.
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override @JsonKey(includeFromJson: false, includeToJson: false)
// Explains: Give the Dart compiler an optimization hint for the following generated helper.
@pragma('vm:prefer-inline')
// Explains: Support immutable copies of this model; unspecified fields retain their current values.
_$GeoLocationCopyWith<_GeoLocation> get copyWith => __$GeoLocationCopyWithImpl<_GeoLocation>(this, _$identity);

// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override
// Explains: Expose serialization of this immutable model through its generated field mapper.
Map<String, dynamic> toJson() {
  // Explains: Map between this generated concrete model and its serialized field representation.
  return _$GeoLocationToJson(this, );
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override
// Explains: Compare model values instead of requiring both references to be the same object.
bool operator ==(Object other) {
    // Explains: Short-circuit identity matches, then compare the relevant generated model fields for equality.
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _GeoLocation&&(identical(other.lat, lat) || other.lat == lat)&&(identical(other.lng, lng) || other.lng == lng)&&(identical(other.geohash, geohash) || other.geohash == geohash));
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Specify the persisted JSON key or whether the following member participates in serialization.
@JsonKey(includeFromJson: false, includeToJson: false)
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override
// Explains: Compute a hash consistent with value equality so models work correctly in sets/maps.
int get hashCode {
    // Explains: Compute a hash consistent with value equality so models work correctly in sets/maps.
    return Object.hash(runtimeType,lat,lng,geohash);
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override
// Explains: Produce a readable diagnostic model representation for debugging.
String toString() {
    // Explains: Return the formatted model description including its current field values.
    return 'GeoLocation(lat: $lat, lng: $lng, geohash: $geohash)';
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}


// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

/// @nodoc
// Explains: Define generated immutable-copy support; change the model source rather than this helper.
abstract mixin class _$GeoLocationCopyWith<$Res> implements $GeoLocationCopyWith<$Res> {
  // Explains: Support immutable copies of this model; unspecified fields retain their current values.
  factory _$GeoLocationCopyWith(_GeoLocation value, $Res Function(_GeoLocation) _then) = __$GeoLocationCopyWithImpl;
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override @useResult
// Explains: Declare the generated copyWith call signature and replacement-field arguments.
$Res call({
 // Explains: Declare/configure lat: latitude in decimal degrees; lng: longitude in decimal degrees; geohash: the spatial prefix used to narrow location searches.
 double lat, double lng, String geohash
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
});




// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
/// @nodoc
// Explains: Define generated immutable-copy support; change the model source rather than this helper.
class __$GeoLocationCopyWithImpl<$Res>
    // Explains: Support immutable copies of this model; unspecified fields retain their current values.
    implements _$GeoLocationCopyWith<$Res> {
  // Explains: Support immutable copies of this model; unspecified fields retain their current values.
  __$GeoLocationCopyWithImpl(this._self, this._then);

  // Explains: Store the immutable model field or generated copy callback used by the methods below.
  final _GeoLocation _self;
  // Explains: Store the callback that converts a copied model into the requested result type.
  final $Res Function(_GeoLocation) _then;

/// Create a copy of GeoLocation
/// with the given fields replaced by the non-null parameter values.
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override @pragma('vm:prefer-inline') $Res call({Object? lat = null,Object? lng = null,Object? geohash = null,}) {
  // Explains: Pass the newly constructed immutable copy through the generated result callback.
  return _then(_GeoLocation(
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
lat: null == lat ? _self.lat : lat // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as double,lng: null == lng ? _self.lng : lng // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as double,geohash: null == geohash ? _self.geohash : geohash // ignore: cast_nullable_to_non_nullable
// Explains: Cast the copied/deserialized value back to the declared field type after null/default handling.
as String,
  // Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
  ));
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}


// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}


/// @nodoc
// Explains: Define the generated implementation/interface for the model; fields originate in models.dart.
mixin _$UserModel {

 // Explains: Declare/configure id: the document identifier, supplied separately from Firestore data; name: the display name shown to other users; isClient: whether the account has the client role; isWorker: whether the account has the worker role; onboardingComplete: whether required profile setup is finished; photoUrl: the optional profile-photo URL; city: the selected city; geo: the location used for nearby matching; createdAt: the creation time stored in UTC.
 String get id; String get name; bool get isClient; bool get isWorker; bool get onboardingComplete; String? get photoUrl; String? get city; GeoLocation? get geo;@FirestoreDate() DateTime get createdAt;
/// Create a copy of UserModel
/// with the given fields replaced by the non-null parameter values.
// Explains: Specify the persisted JSON key or whether the following member participates in serialization.
@JsonKey(includeFromJson: false, includeToJson: false)
// Explains: Give the Dart compiler an optimization hint for the following generated helper.
@pragma('vm:prefer-inline')
// Explains: Support immutable copies of this model; unspecified fields retain their current values.
$UserModelCopyWith<UserModel> get copyWith => _$UserModelCopyWithImpl<UserModel>(this as UserModel, _$identity);

  /// Serializes this UserModel to a JSON map.
  // Explains: Expose serialization of this immutable model through its generated field mapper.
  Map<String, dynamic> toJson();


// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override
// Explains: Compare model values instead of requiring both references to be the same object.
bool operator ==(Object other) {
  // Explains: View this generated mixin as its concrete model before accessing typed fields.
  final _this = this as UserModel;
  // Explains: Short-circuit identity matches, then compare the relevant generated model fields for equality.
  return identical(this, other) || (other.runtimeType == runtimeType&&other is UserModel&&(identical(other.id, _this.id) || other.id == _this.id)&&(identical(other.name, _this.name) || other.name == _this.name)&&(identical(other.isClient, _this.isClient) || other.isClient == _this.isClient)&&(identical(other.isWorker, _this.isWorker) || other.isWorker == _this.isWorker)&&(identical(other.onboardingComplete, _this.onboardingComplete) || other.onboardingComplete == _this.onboardingComplete)&&(identical(other.photoUrl, _this.photoUrl) || other.photoUrl == _this.photoUrl)&&(identical(other.city, _this.city) || other.city == _this.city)&&(identical(other.geo, _this.geo) || other.geo == _this.geo)&&(identical(other.createdAt, _this.createdAt) || other.createdAt == _this.createdAt));
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Specify the persisted JSON key or whether the following member participates in serialization.
@JsonKey(includeFromJson: false, includeToJson: false)
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override
// Explains: Compute a hash consistent with value equality so models work correctly in sets/maps.
int get hashCode {
  // Explains: View this generated mixin as its concrete model before accessing typed fields.
  final _this = this as UserModel;
  // Explains: Compute a hash consistent with value equality so models work correctly in sets/maps.
  return Object.hash(runtimeType,_this.id,_this.name,_this.isClient,_this.isWorker,_this.onboardingComplete,_this.photoUrl,_this.city,_this.geo,_this.createdAt);
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override
// Explains: Produce a readable diagnostic model representation for debugging.
String toString() {
  // Explains: View this generated mixin as its concrete model before accessing typed fields.
  final _this = this as UserModel;
  // Explains: Return the formatted model description including its current field values.
  return 'UserModel(id: ${_this.id}, name: ${_this.name}, isClient: ${_this.isClient}, isWorker: ${_this.isWorker}, onboardingComplete: ${_this.onboardingComplete}, photoUrl: ${_this.photoUrl}, city: ${_this.city}, geo: ${_this.geo}, createdAt: ${_this.createdAt})';
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}


// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

/// @nodoc
// Explains: Define generated immutable-copy support; change the model source rather than this helper.
abstract mixin class $UserModelCopyWith<$Res>  {
  // Explains: Support immutable copies of this model; unspecified fields retain their current values.
  factory $UserModelCopyWith(UserModel value, $Res Function(UserModel) _then) = _$UserModelCopyWithImpl;
// Explains: Tell analysis tools that callers should use the returned copied value.
@useResult
// Explains: Declare the generated copyWith call signature and replacement-field arguments.
$Res call({
 // Explains: Declare/configure id: the document identifier, supplied separately from Firestore data; name: the display name shown to other users; isClient: whether the account has the client role; isWorker: whether the account has the worker role; onboardingComplete: whether required profile setup is finished; photoUrl: the optional profile-photo URL; city: the selected city; geo: the location used for nearby matching; createdAt: the creation time stored in UTC.
 String id, String name, bool isClient, bool isWorker, bool onboardingComplete, String? photoUrl, String? city, GeoLocation? geo,@FirestoreDate() DateTime createdAt
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
});


// Explains: Support immutable copies of this model; unspecified fields retain their current values.
$GeoLocationCopyWith<$Res>? get geo;

// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
/// @nodoc
// Explains: Define generated immutable-copy support; change the model source rather than this helper.
class _$UserModelCopyWithImpl<$Res>
    // Explains: Support immutable copies of this model; unspecified fields retain their current values.
    implements $UserModelCopyWith<$Res> {
  // Explains: Support immutable copies of this model; unspecified fields retain their current values.
  _$UserModelCopyWithImpl(this._self, this._then);

  // Explains: Store the immutable model field or generated copy callback used by the methods below.
  final UserModel _self;
  // Explains: Store the callback that converts a copied model into the requested result type.
  final $Res Function(UserModel) _then;

/// Create a copy of UserModel
/// with the given fields replaced by the non-null parameter values.
// Explains: Give the Dart compiler an optimization hint for the following generated helper.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? name = null,Object? isClient = null,Object? isWorker = null,Object? onboardingComplete = null,Object? photoUrl = freezed,Object? city = freezed,Object? geo = freezed,Object? createdAt = null,}) {
  // Explains: Pass the newly constructed immutable copy through the generated result callback.
  return _then(UserModel(
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as String,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as String,isClient: null == isClient ? _self.isClient : isClient // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as bool,isWorker: null == isWorker ? _self.isWorker : isWorker // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as bool,onboardingComplete: null == onboardingComplete ? _self.onboardingComplete : onboardingComplete // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as bool,photoUrl: freezed == photoUrl ? _self.photoUrl : photoUrl // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as String?,city: freezed == city ? _self.city : city // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as String?,geo: freezed == geo ? _self.geo : geo // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as GeoLocation?,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
// Explains: Cast the copied/deserialized value back to the declared field type after null/default handling.
as DateTime,
  // Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
  ));
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
/// Create a copy of UserModel
/// with the given fields replaced by the non-null parameter values.
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override
// Explains: Give the Dart compiler an optimization hint for the following generated helper.
@pragma('vm:prefer-inline')
// Explains: Support immutable copies of this model; unspecified fields retain their current values.
$GeoLocationCopyWith<$Res>? get geo {
    // Explains: Evaluate the stated guard before entering this branch of the enclosing operation.
    if (_self.geo == null) {
    // Explains: Return no result/error; callers interpret null according to this method contract.
    return null;
  // Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
  }

  // Explains: Support immutable copies of this model; unspecified fields retain their current values.
  return $GeoLocationCopyWith<$Res>(_self.geo!, (value) {
    // Explains: Pass the newly constructed immutable copy through the generated result callback.
    return _then(_self.copyWith(geo: value));
  // Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
  });
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}


/// Adds pattern-matching-related methods to [UserModel].
// Explains: Group generated callbacks for matching this model variant and choosing a return value.
extension UserModelPatterns on UserModel {
/// A variant of `map` that fallback to returning `orElse`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

// Explains: Define generated pattern matching whose result type can be inferred by callers.
@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _UserModel value)?  $default,{required TResult orElse(),}){
// Explains: Capture the model instance for generated variant dispatch.
final _that = this;
// Explains: Choose the callback matching this generated model variant.
switch (_that) {
// Explains: Handle the matching model variant, or the fallback case when no typed callback applies.
case _UserModel() when $default != null:
// Explains: Invoke the callback with the matched model or its destructured fields and return its result.
return $default(_that);case _:
  // Explains: Run the caller fallback because the requested model callback does not apply.
  return orElse();

// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
/// A `switch`-like method, using callbacks.
///
/// Callbacks receives the raw object, upcasted.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case final Subclass2 value:
///     return ...;
/// }
/// ```

// Explains: Define generated pattern matching whose result type can be inferred by callers.
@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _UserModel value)  $default,){
// Explains: Capture the model instance for generated variant dispatch.
final _that = this;
// Explains: Choose the callback matching this generated model variant.
switch (_that) {
// Explains: Handle the matching model variant, or the fallback case when no typed callback applies.
case _UserModel():
// Explains: Invoke the callback with the matched model or its destructured fields and return its result.
return $default(_that);case _:
  // Explains: Stop this operation with an explicit error because the input or model variant is unsupported.
  throw StateError('Unexpected subclass');

// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
/// A variant of `map` that fallback to returning `null`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return null;
/// }
/// ```

// Explains: Define generated pattern matching whose result type can be inferred by callers.
@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _UserModel value)?  $default,){
// Explains: Capture the model instance for generated variant dispatch.
final _that = this;
// Explains: Choose the callback matching this generated model variant.
switch (_that) {
// Explains: Handle the matching model variant, or the fallback case when no typed callback applies.
case _UserModel() when $default != null:
// Explains: Invoke the callback with the matched model or its destructured fields and return its result.
return $default(_that);case _:
  // Explains: Return no result/error; callers interpret null according to this method contract.
  return null;

// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
/// A variant of `when` that fallback to an `orElse` callback.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

// Explains: Define generated pattern matching whose result type can be inferred by callers.
@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id,  String name,  bool isClient,  bool isWorker,  bool onboardingComplete,  String? photoUrl,  String? city,  GeoLocation? geo, @FirestoreDate()  DateTime createdAt)?  $default,{required TResult orElse(),}) {final _that = this;
// Explains: Choose the callback matching this generated model variant.
switch (_that) {
// Explains: Handle the matching model variant, or the fallback case when no typed callback applies.
case _UserModel() when $default != null:
// Explains: Invoke the callback with the matched model or its destructured fields and return its result.
return $default(_that.id,_that.name,_that.isClient,_that.isWorker,_that.onboardingComplete,_that.photoUrl,_that.city,_that.geo,_that.createdAt);case _:
  // Explains: Run the caller fallback because the requested model callback does not apply.
  return orElse();

// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
/// A `switch`-like method, using callbacks.
///
/// As opposed to `map`, this offers destructuring.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case Subclass2(:final field2):
///     return ...;
/// }
/// ```

// Explains: Define generated pattern matching whose result type can be inferred by callers.
@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id,  String name,  bool isClient,  bool isWorker,  bool onboardingComplete,  String? photoUrl,  String? city,  GeoLocation? geo, @FirestoreDate()  DateTime createdAt)  $default,) {final _that = this;
// Explains: Choose the callback matching this generated model variant.
switch (_that) {
// Explains: Handle the matching model variant, or the fallback case when no typed callback applies.
case _UserModel():
// Explains: Invoke the callback with the matched model or its destructured fields and return its result.
return $default(_that.id,_that.name,_that.isClient,_that.isWorker,_that.onboardingComplete,_that.photoUrl,_that.city,_that.geo,_that.createdAt);case _:
  // Explains: Stop this operation with an explicit error because the input or model variant is unsupported.
  throw StateError('Unexpected subclass');

// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
/// A variant of `when` that fallback to returning `null`
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return null;
/// }
/// ```

// Explains: Define generated pattern matching whose result type can be inferred by callers.
@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id,  String name,  bool isClient,  bool isWorker,  bool onboardingComplete,  String? photoUrl,  String? city,  GeoLocation? geo, @FirestoreDate()  DateTime createdAt)?  $default,) {final _that = this;
// Explains: Choose the callback matching this generated model variant.
switch (_that) {
// Explains: Handle the matching model variant, or the fallback case when no typed callback applies.
case _UserModel() when $default != null:
// Explains: Invoke the callback with the matched model or its destructured fields and return its result.
return $default(_that.id,_that.name,_that.isClient,_that.isWorker,_that.onboardingComplete,_that.photoUrl,_that.city,_that.geo,_that.createdAt);case _:
  // Explains: Return no result/error; callers interpret null according to this method contract.
  return null;

// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

/// @nodoc
// Explains: Generate the field-to-JSON and JSON-to-field mapping for this concrete immutable model.
@JsonSerializable()

// Explains: Define the generated implementation/interface for the model; fields originate in models.dart.
class _UserModel extends UserModel {
  // Explains: Declare/configure id: the document identifier, supplied separately from Firestore data; name: the display name shown to other users; isClient: whether the account has the client role; isWorker: whether the account has the worker role; onboardingComplete: whether required profile setup is finished; photoUrl: the optional profile-photo URL; city: the selected city; geo: the location used for nearby matching; createdAt: the creation time stored in UTC.
  const _UserModel({required this.id, required this.name, this.isClient = false, this.isWorker = false, this.onboardingComplete = false, this.photoUrl, this.city, this.geo, @FirestoreDate() required this.createdAt}): super._();
  // Explains: Delegate field parsing to the generated JSON deserializer for this model.
  factory _UserModel.fromJson(Map<String, dynamic> json) => _$UserModelFromJson(json);

// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override final  String id;
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override final  String name;
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override@JsonKey() final  bool isClient;
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override@JsonKey() final  bool isWorker;
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override@JsonKey() final  bool onboardingComplete;
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override final  String? photoUrl;
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override final  String? city;
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override final  GeoLocation? geo;
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override@FirestoreDate() final  DateTime createdAt;

/// Create a copy of UserModel
/// with the given fields replaced by the non-null parameter values.
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override @JsonKey(includeFromJson: false, includeToJson: false)
// Explains: Give the Dart compiler an optimization hint for the following generated helper.
@pragma('vm:prefer-inline')
// Explains: Support immutable copies of this model; unspecified fields retain their current values.
_$UserModelCopyWith<_UserModel> get copyWith => __$UserModelCopyWithImpl<_UserModel>(this, _$identity);

// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override
// Explains: Expose serialization of this immutable model through its generated field mapper.
Map<String, dynamic> toJson() {
  // Explains: Map between this generated concrete model and its serialized field representation.
  return _$UserModelToJson(this, );
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override
// Explains: Compare model values instead of requiring both references to be the same object.
bool operator ==(Object other) {
    // Explains: Short-circuit identity matches, then compare the relevant generated model fields for equality.
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _UserModel&&(identical(other.id, id) || other.id == id)&&(identical(other.name, name) || other.name == name)&&(identical(other.isClient, isClient) || other.isClient == isClient)&&(identical(other.isWorker, isWorker) || other.isWorker == isWorker)&&(identical(other.onboardingComplete, onboardingComplete) || other.onboardingComplete == onboardingComplete)&&(identical(other.photoUrl, photoUrl) || other.photoUrl == photoUrl)&&(identical(other.city, city) || other.city == city)&&(identical(other.geo, geo) || other.geo == geo)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt));
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Specify the persisted JSON key or whether the following member participates in serialization.
@JsonKey(includeFromJson: false, includeToJson: false)
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override
// Explains: Compute a hash consistent with value equality so models work correctly in sets/maps.
int get hashCode {
    // Explains: Compute a hash consistent with value equality so models work correctly in sets/maps.
    return Object.hash(runtimeType,id,name,isClient,isWorker,onboardingComplete,photoUrl,city,geo,createdAt);
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override
// Explains: Produce a readable diagnostic model representation for debugging.
String toString() {
    // Explains: Return the formatted model description including its current field values.
    return 'UserModel(id: $id, name: $name, isClient: $isClient, isWorker: $isWorker, onboardingComplete: $onboardingComplete, photoUrl: $photoUrl, city: $city, geo: $geo, createdAt: $createdAt)';
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}


// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

/// @nodoc
// Explains: Define generated immutable-copy support; change the model source rather than this helper.
abstract mixin class _$UserModelCopyWith<$Res> implements $UserModelCopyWith<$Res> {
  // Explains: Support immutable copies of this model; unspecified fields retain their current values.
  factory _$UserModelCopyWith(_UserModel value, $Res Function(_UserModel) _then) = __$UserModelCopyWithImpl;
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override @useResult
// Explains: Declare the generated copyWith call signature and replacement-field arguments.
$Res call({
 // Explains: Declare/configure id: the document identifier, supplied separately from Firestore data; name: the display name shown to other users; isClient: whether the account has the client role; isWorker: whether the account has the worker role; onboardingComplete: whether required profile setup is finished; photoUrl: the optional profile-photo URL; city: the selected city; geo: the location used for nearby matching; createdAt: the creation time stored in UTC.
 String id, String name, bool isClient, bool isWorker, bool onboardingComplete, String? photoUrl, String? city, GeoLocation? geo,@FirestoreDate() DateTime createdAt
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
});


// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override $GeoLocationCopyWith<$Res>? get geo;

// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
/// @nodoc
// Explains: Define generated immutable-copy support; change the model source rather than this helper.
class __$UserModelCopyWithImpl<$Res>
    // Explains: Support immutable copies of this model; unspecified fields retain their current values.
    implements _$UserModelCopyWith<$Res> {
  // Explains: Support immutable copies of this model; unspecified fields retain their current values.
  __$UserModelCopyWithImpl(this._self, this._then);

  // Explains: Store the immutable model field or generated copy callback used by the methods below.
  final _UserModel _self;
  // Explains: Store the callback that converts a copied model into the requested result type.
  final $Res Function(_UserModel) _then;

/// Create a copy of UserModel
/// with the given fields replaced by the non-null parameter values.
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? name = null,Object? isClient = null,Object? isWorker = null,Object? onboardingComplete = null,Object? photoUrl = freezed,Object? city = freezed,Object? geo = freezed,Object? createdAt = null,}) {
  // Explains: Pass the newly constructed immutable copy through the generated result callback.
  return _then(_UserModel(
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as String,name: null == name ? _self.name : name // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as String,isClient: null == isClient ? _self.isClient : isClient // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as bool,isWorker: null == isWorker ? _self.isWorker : isWorker // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as bool,onboardingComplete: null == onboardingComplete ? _self.onboardingComplete : onboardingComplete // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as bool,photoUrl: freezed == photoUrl ? _self.photoUrl : photoUrl // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as String?,city: freezed == city ? _self.city : city // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as String?,geo: freezed == geo ? _self.geo : geo // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as GeoLocation?,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
// Explains: Cast the copied/deserialized value back to the declared field type after null/default handling.
as DateTime,
  // Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
  ));
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

/// Create a copy of UserModel
/// with the given fields replaced by the non-null parameter values.
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override
// Explains: Give the Dart compiler an optimization hint for the following generated helper.
@pragma('vm:prefer-inline')
// Explains: Support immutable copies of this model; unspecified fields retain their current values.
$GeoLocationCopyWith<$Res>? get geo {
    // Explains: Evaluate the stated guard before entering this branch of the enclosing operation.
    if (_self.geo == null) {
    // Explains: Return no result/error; callers interpret null according to this method contract.
    return null;
  // Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
  }

  // Explains: Support immutable copies of this model; unspecified fields retain their current values.
  return $GeoLocationCopyWith<$Res>(_self.geo!, (value) {
    // Explains: Pass the newly constructed immutable copy through the generated result callback.
    return _then(_self.copyWith(geo: value));
  // Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
  });
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}


/// @nodoc
// Explains: Define the generated implementation/interface for the model; fields originate in models.dart.
mixin _$WorkerProfile {

 // Explains: Declare/configure id: the document identifier, supplied separately from Firestore data; skills: category IDs describing the worker skills; bio: the worker introduction; experienceYears: years of relevant experience; dayRateMinor: the daily rate in integer currency subunits; currency: the currency code, initially LKR; base: the worker base location; serviceRadiusKm: the maximum travel radius in kilometres; portfolio: the worker portfolio image URLs; ratingAvg: the server-maintained average rating; ratingCount: the server-maintained number of ratings; jobsCompleted: the server-maintained completed-job count; isAvailable: whether the worker is currently available; isVerified: the server-controlled verification flag.
 String get id; List<String> get skills; String get bio; int get experienceYears; int get dayRateMinor; String get currency; GeoLocation get base; double get serviceRadiusKm; List<String> get portfolio; double get ratingAvg; int get ratingCount; int get jobsCompleted; bool get isAvailable; bool get isVerified;
/// Create a copy of WorkerProfile
/// with the given fields replaced by the non-null parameter values.
// Explains: Specify the persisted JSON key or whether the following member participates in serialization.
@JsonKey(includeFromJson: false, includeToJson: false)
// Explains: Give the Dart compiler an optimization hint for the following generated helper.
@pragma('vm:prefer-inline')
// Explains: Support immutable copies of this model; unspecified fields retain their current values.
$WorkerProfileCopyWith<WorkerProfile> get copyWith => _$WorkerProfileCopyWithImpl<WorkerProfile>(this as WorkerProfile, _$identity);

  /// Serializes this WorkerProfile to a JSON map.
  // Explains: Expose serialization of this immutable model through its generated field mapper.
  Map<String, dynamic> toJson();


// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override
// Explains: Compare model values instead of requiring both references to be the same object.
bool operator ==(Object other) {
  // Explains: View this generated mixin as its concrete model before accessing typed fields.
  final _this = this as WorkerProfile;
  // Explains: Short-circuit identity matches, then compare the relevant generated model fields for equality.
  return identical(this, other) || (other.runtimeType == runtimeType&&other is WorkerProfile&&(identical(other.id, _this.id) || other.id == _this.id)&&const DeepCollectionEquality().equals(other.skills, _this.skills)&&(identical(other.bio, _this.bio) || other.bio == _this.bio)&&(identical(other.experienceYears, _this.experienceYears) || other.experienceYears == _this.experienceYears)&&(identical(other.dayRateMinor, _this.dayRateMinor) || other.dayRateMinor == _this.dayRateMinor)&&(identical(other.currency, _this.currency) || other.currency == _this.currency)&&(identical(other.base, _this.base) || other.base == _this.base)&&(identical(other.serviceRadiusKm, _this.serviceRadiusKm) || other.serviceRadiusKm == _this.serviceRadiusKm)&&const DeepCollectionEquality().equals(other.portfolio, _this.portfolio)&&(identical(other.ratingAvg, _this.ratingAvg) || other.ratingAvg == _this.ratingAvg)&&(identical(other.ratingCount, _this.ratingCount) || other.ratingCount == _this.ratingCount)&&(identical(other.jobsCompleted, _this.jobsCompleted) || other.jobsCompleted == _this.jobsCompleted)&&(identical(other.isAvailable, _this.isAvailable) || other.isAvailable == _this.isAvailable)&&(identical(other.isVerified, _this.isVerified) || other.isVerified == _this.isVerified));
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Specify the persisted JSON key or whether the following member participates in serialization.
@JsonKey(includeFromJson: false, includeToJson: false)
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override
// Explains: Compute a hash consistent with value equality so models work correctly in sets/maps.
int get hashCode {
  // Explains: View this generated mixin as its concrete model before accessing typed fields.
  final _this = this as WorkerProfile;
  // Explains: Compute a hash consistent with value equality so models work correctly in sets/maps.
  return Object.hash(runtimeType,_this.id,const DeepCollectionEquality().hash(_this.skills),_this.bio,_this.experienceYears,_this.dayRateMinor,_this.currency,_this.base,_this.serviceRadiusKm,const DeepCollectionEquality().hash(_this.portfolio),_this.ratingAvg,_this.ratingCount,_this.jobsCompleted,_this.isAvailable,_this.isVerified);
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override
// Explains: Produce a readable diagnostic model representation for debugging.
String toString() {
  // Explains: View this generated mixin as its concrete model before accessing typed fields.
  final _this = this as WorkerProfile;
  // Explains: Return the formatted model description including its current field values.
  return 'WorkerProfile(id: ${_this.id}, skills: ${_this.skills}, bio: ${_this.bio}, experienceYears: ${_this.experienceYears}, dayRateMinor: ${_this.dayRateMinor}, currency: ${_this.currency}, base: ${_this.base}, serviceRadiusKm: ${_this.serviceRadiusKm}, portfolio: ${_this.portfolio}, ratingAvg: ${_this.ratingAvg}, ratingCount: ${_this.ratingCount}, jobsCompleted: ${_this.jobsCompleted}, isAvailable: ${_this.isAvailable}, isVerified: ${_this.isVerified})';
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}


// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

/// @nodoc
// Explains: Define generated immutable-copy support; change the model source rather than this helper.
abstract mixin class $WorkerProfileCopyWith<$Res>  {
  // Explains: Support immutable copies of this model; unspecified fields retain their current values.
  factory $WorkerProfileCopyWith(WorkerProfile value, $Res Function(WorkerProfile) _then) = _$WorkerProfileCopyWithImpl;
// Explains: Tell analysis tools that callers should use the returned copied value.
@useResult
// Explains: Declare the generated copyWith call signature and replacement-field arguments.
$Res call({
 // Explains: Declare/configure id: the document identifier, supplied separately from Firestore data; skills: category IDs describing the worker skills; bio: the worker introduction; experienceYears: years of relevant experience; dayRateMinor: the daily rate in integer currency subunits; currency: the currency code, initially LKR; base: the worker base location; serviceRadiusKm: the maximum travel radius in kilometres; portfolio: the worker portfolio image URLs; ratingAvg: the server-maintained average rating; ratingCount: the server-maintained number of ratings; jobsCompleted: the server-maintained completed-job count; isAvailable: whether the worker is currently available; isVerified: the server-controlled verification flag.
 String id, List<String> skills, String bio, int experienceYears, int dayRateMinor, String currency, GeoLocation base, double serviceRadiusKm, List<String> portfolio, double ratingAvg, int ratingCount, int jobsCompleted, bool isAvailable, bool isVerified
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
});


// Explains: Support immutable copies of this model; unspecified fields retain their current values.
$GeoLocationCopyWith<$Res> get base;

// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
/// @nodoc
// Explains: Define generated immutable-copy support; change the model source rather than this helper.
class _$WorkerProfileCopyWithImpl<$Res>
    // Explains: Support immutable copies of this model; unspecified fields retain their current values.
    implements $WorkerProfileCopyWith<$Res> {
  // Explains: Support immutable copies of this model; unspecified fields retain their current values.
  _$WorkerProfileCopyWithImpl(this._self, this._then);

  // Explains: Store the immutable model field or generated copy callback used by the methods below.
  final WorkerProfile _self;
  // Explains: Store the callback that converts a copied model into the requested result type.
  final $Res Function(WorkerProfile) _then;

/// Create a copy of WorkerProfile
/// with the given fields replaced by the non-null parameter values.
// Explains: Give the Dart compiler an optimization hint for the following generated helper.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? skills = null,Object? bio = null,Object? experienceYears = null,Object? dayRateMinor = null,Object? currency = null,Object? base = null,Object? serviceRadiusKm = null,Object? portfolio = null,Object? ratingAvg = null,Object? ratingCount = null,Object? jobsCompleted = null,Object? isAvailable = null,Object? isVerified = null,}) {
  // Explains: Pass the newly constructed immutable copy through the generated result callback.
  return _then(WorkerProfile(
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as String,skills: null == skills ? _self.skills : skills // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as List<String>,bio: null == bio ? _self.bio : bio // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as String,experienceYears: null == experienceYears ? _self.experienceYears : experienceYears // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as int,dayRateMinor: null == dayRateMinor ? _self.dayRateMinor : dayRateMinor // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as int,currency: null == currency ? _self.currency : currency // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as String,base: null == base ? _self.base : base // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as GeoLocation,serviceRadiusKm: null == serviceRadiusKm ? _self.serviceRadiusKm : serviceRadiusKm // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as double,portfolio: null == portfolio ? _self.portfolio : portfolio // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as List<String>,ratingAvg: null == ratingAvg ? _self.ratingAvg : ratingAvg // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as double,ratingCount: null == ratingCount ? _self.ratingCount : ratingCount // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as int,jobsCompleted: null == jobsCompleted ? _self.jobsCompleted : jobsCompleted // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as int,isAvailable: null == isAvailable ? _self.isAvailable : isAvailable // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as bool,isVerified: null == isVerified ? _self.isVerified : isVerified // ignore: cast_nullable_to_non_nullable
// Explains: Cast the copied/deserialized value back to the declared field type after null/default handling.
as bool,
  // Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
  ));
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
/// Create a copy of WorkerProfile
/// with the given fields replaced by the non-null parameter values.
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override
// Explains: Give the Dart compiler an optimization hint for the following generated helper.
@pragma('vm:prefer-inline')
// Explains: Support immutable copies of this model; unspecified fields retain their current values.
$GeoLocationCopyWith<$Res> get base {
  
  // Explains: Support immutable copies of this model; unspecified fields retain their current values.
  return $GeoLocationCopyWith<$Res>(_self.base, (value) {
    // Explains: Pass the newly constructed immutable copy through the generated result callback.
    return _then(_self.copyWith(base: value));
  // Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
  });
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}


/// Adds pattern-matching-related methods to [WorkerProfile].
// Explains: Group generated callbacks for matching this model variant and choosing a return value.
extension WorkerProfilePatterns on WorkerProfile {
/// A variant of `map` that fallback to returning `orElse`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

// Explains: Define generated pattern matching whose result type can be inferred by callers.
@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _WorkerProfile value)?  $default,{required TResult orElse(),}){
// Explains: Capture the model instance for generated variant dispatch.
final _that = this;
// Explains: Choose the callback matching this generated model variant.
switch (_that) {
// Explains: Handle the matching model variant, or the fallback case when no typed callback applies.
case _WorkerProfile() when $default != null:
// Explains: Invoke the callback with the matched model or its destructured fields and return its result.
return $default(_that);case _:
  // Explains: Run the caller fallback because the requested model callback does not apply.
  return orElse();

// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
/// A `switch`-like method, using callbacks.
///
/// Callbacks receives the raw object, upcasted.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case final Subclass2 value:
///     return ...;
/// }
/// ```

// Explains: Define generated pattern matching whose result type can be inferred by callers.
@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _WorkerProfile value)  $default,){
// Explains: Capture the model instance for generated variant dispatch.
final _that = this;
// Explains: Choose the callback matching this generated model variant.
switch (_that) {
// Explains: Handle the matching model variant, or the fallback case when no typed callback applies.
case _WorkerProfile():
// Explains: Invoke the callback with the matched model or its destructured fields and return its result.
return $default(_that);case _:
  // Explains: Stop this operation with an explicit error because the input or model variant is unsupported.
  throw StateError('Unexpected subclass');

// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
/// A variant of `map` that fallback to returning `null`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return null;
/// }
/// ```

// Explains: Define generated pattern matching whose result type can be inferred by callers.
@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _WorkerProfile value)?  $default,){
// Explains: Capture the model instance for generated variant dispatch.
final _that = this;
// Explains: Choose the callback matching this generated model variant.
switch (_that) {
// Explains: Handle the matching model variant, or the fallback case when no typed callback applies.
case _WorkerProfile() when $default != null:
// Explains: Invoke the callback with the matched model or its destructured fields and return its result.
return $default(_that);case _:
  // Explains: Return no result/error; callers interpret null according to this method contract.
  return null;

// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
/// A variant of `when` that fallback to an `orElse` callback.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

// Explains: Define generated pattern matching whose result type can be inferred by callers.
@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id,  List<String> skills,  String bio,  int experienceYears,  int dayRateMinor,  String currency,  GeoLocation base,  double serviceRadiusKm,  List<String> portfolio,  double ratingAvg,  int ratingCount,  int jobsCompleted,  bool isAvailable,  bool isVerified)?  $default,{required TResult orElse(),}) {final _that = this;
// Explains: Choose the callback matching this generated model variant.
switch (_that) {
// Explains: Handle the matching model variant, or the fallback case when no typed callback applies.
case _WorkerProfile() when $default != null:
// Explains: Invoke the callback with the matched model or its destructured fields and return its result.
return $default(_that.id,_that.skills,_that.bio,_that.experienceYears,_that.dayRateMinor,_that.currency,_that.base,_that.serviceRadiusKm,_that.portfolio,_that.ratingAvg,_that.ratingCount,_that.jobsCompleted,_that.isAvailable,_that.isVerified);case _:
  // Explains: Run the caller fallback because the requested model callback does not apply.
  return orElse();

// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
/// A `switch`-like method, using callbacks.
///
/// As opposed to `map`, this offers destructuring.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case Subclass2(:final field2):
///     return ...;
/// }
/// ```

// Explains: Define generated pattern matching whose result type can be inferred by callers.
@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id,  List<String> skills,  String bio,  int experienceYears,  int dayRateMinor,  String currency,  GeoLocation base,  double serviceRadiusKm,  List<String> portfolio,  double ratingAvg,  int ratingCount,  int jobsCompleted,  bool isAvailable,  bool isVerified)  $default,) {final _that = this;
// Explains: Choose the callback matching this generated model variant.
switch (_that) {
// Explains: Handle the matching model variant, or the fallback case when no typed callback applies.
case _WorkerProfile():
// Explains: Invoke the callback with the matched model or its destructured fields and return its result.
return $default(_that.id,_that.skills,_that.bio,_that.experienceYears,_that.dayRateMinor,_that.currency,_that.base,_that.serviceRadiusKm,_that.portfolio,_that.ratingAvg,_that.ratingCount,_that.jobsCompleted,_that.isAvailable,_that.isVerified);case _:
  // Explains: Stop this operation with an explicit error because the input or model variant is unsupported.
  throw StateError('Unexpected subclass');

// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
/// A variant of `when` that fallback to returning `null`
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return null;
/// }
/// ```

// Explains: Define generated pattern matching whose result type can be inferred by callers.
@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id,  List<String> skills,  String bio,  int experienceYears,  int dayRateMinor,  String currency,  GeoLocation base,  double serviceRadiusKm,  List<String> portfolio,  double ratingAvg,  int ratingCount,  int jobsCompleted,  bool isAvailable,  bool isVerified)?  $default,) {final _that = this;
// Explains: Choose the callback matching this generated model variant.
switch (_that) {
// Explains: Handle the matching model variant, or the fallback case when no typed callback applies.
case _WorkerProfile() when $default != null:
// Explains: Invoke the callback with the matched model or its destructured fields and return its result.
return $default(_that.id,_that.skills,_that.bio,_that.experienceYears,_that.dayRateMinor,_that.currency,_that.base,_that.serviceRadiusKm,_that.portfolio,_that.ratingAvg,_that.ratingCount,_that.jobsCompleted,_that.isAvailable,_that.isVerified);case _:
  // Explains: Return no result/error; callers interpret null according to this method contract.
  return null;

// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

/// @nodoc
// Explains: Generate the field-to-JSON and JSON-to-field mapping for this concrete immutable model.
@JsonSerializable()

// Explains: Define the generated implementation/interface for the model; fields originate in models.dart.
class _WorkerProfile extends WorkerProfile {
  // Explains: Declare/configure id: the document identifier, supplied separately from Firestore data; skills: category IDs describing the worker skills; bio: the worker introduction; experienceYears: years of relevant experience; dayRateMinor: the daily rate in integer currency subunits; currency: the currency code, initially LKR; base: the worker base location; serviceRadiusKm: the maximum travel radius in kilometres; portfolio: the worker portfolio image URLs; ratingAvg: the server-maintained average rating; ratingCount: the server-maintained number of ratings; jobsCompleted: the server-maintained completed-job count; isAvailable: whether the worker is currently available; isVerified: the server-controlled verification flag.
  const _WorkerProfile({required this.id,  List<String> skills = const [], this.bio = '', this.experienceYears = 0, required this.dayRateMinor, this.currency = 'LKR', required this.base, required this.serviceRadiusKm,  List<String> portfolio = const [], this.ratingAvg = 0, this.ratingCount = 0, this.jobsCompleted = 0, this.isAvailable = false, this.isVerified = false}): _skills = skills,_portfolio = portfolio,super._();
  // Explains: Delegate field parsing to the generated JSON deserializer for this model.
  factory _WorkerProfile.fromJson(Map<String, dynamic> json) => _$WorkerProfileFromJson(json);

// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override final  String id;
 // Explains: Store the immutable model field or generated copy callback used by the methods below.
 final  List<String> _skills;
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override@JsonKey() List<String> get skills {
  // Explains: Expose collection values through an unmodifiable view to preserve model immutability.
  if (_skills is EqualUnmodifiableListView) return _skills;
  // ignore: implicit_dynamic_type
  // Explains: Expose collection values through an unmodifiable view to preserve model immutability.
  return EqualUnmodifiableListView(_skills);
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override@JsonKey() final  String bio;
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override@JsonKey() final  int experienceYears;
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override final  int dayRateMinor;
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override@JsonKey() final  String currency;
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override final  GeoLocation base;
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override final  double serviceRadiusKm;
 // Explains: Store the immutable model field or generated copy callback used by the methods below.
 final  List<String> _portfolio;
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override@JsonKey() List<String> get portfolio {
  // Explains: Expose collection values through an unmodifiable view to preserve model immutability.
  if (_portfolio is EqualUnmodifiableListView) return _portfolio;
  // ignore: implicit_dynamic_type
  // Explains: Expose collection values through an unmodifiable view to preserve model immutability.
  return EqualUnmodifiableListView(_portfolio);
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override@JsonKey() final  double ratingAvg;
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override@JsonKey() final  int ratingCount;
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override@JsonKey() final  int jobsCompleted;
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override@JsonKey() final  bool isAvailable;
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override@JsonKey() final  bool isVerified;

/// Create a copy of WorkerProfile
/// with the given fields replaced by the non-null parameter values.
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override @JsonKey(includeFromJson: false, includeToJson: false)
// Explains: Give the Dart compiler an optimization hint for the following generated helper.
@pragma('vm:prefer-inline')
// Explains: Support immutable copies of this model; unspecified fields retain their current values.
_$WorkerProfileCopyWith<_WorkerProfile> get copyWith => __$WorkerProfileCopyWithImpl<_WorkerProfile>(this, _$identity);

// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override
// Explains: Expose serialization of this immutable model through its generated field mapper.
Map<String, dynamic> toJson() {
  // Explains: Map between this generated concrete model and its serialized field representation.
  return _$WorkerProfileToJson(this, );
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override
// Explains: Compare model values instead of requiring both references to be the same object.
bool operator ==(Object other) {
    // Explains: Short-circuit identity matches, then compare the relevant generated model fields for equality.
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _WorkerProfile&&(identical(other.id, id) || other.id == id)&&const DeepCollectionEquality().equals(other.skills, _skills)&&(identical(other.bio, bio) || other.bio == bio)&&(identical(other.experienceYears, experienceYears) || other.experienceYears == experienceYears)&&(identical(other.dayRateMinor, dayRateMinor) || other.dayRateMinor == dayRateMinor)&&(identical(other.currency, currency) || other.currency == currency)&&(identical(other.base, base) || other.base == base)&&(identical(other.serviceRadiusKm, serviceRadiusKm) || other.serviceRadiusKm == serviceRadiusKm)&&const DeepCollectionEquality().equals(other.portfolio, _portfolio)&&(identical(other.ratingAvg, ratingAvg) || other.ratingAvg == ratingAvg)&&(identical(other.ratingCount, ratingCount) || other.ratingCount == ratingCount)&&(identical(other.jobsCompleted, jobsCompleted) || other.jobsCompleted == jobsCompleted)&&(identical(other.isAvailable, isAvailable) || other.isAvailable == isAvailable)&&(identical(other.isVerified, isVerified) || other.isVerified == isVerified));
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Specify the persisted JSON key or whether the following member participates in serialization.
@JsonKey(includeFromJson: false, includeToJson: false)
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override
// Explains: Compute a hash consistent with value equality so models work correctly in sets/maps.
int get hashCode {
    // Explains: Compute a hash consistent with value equality so models work correctly in sets/maps.
    return Object.hash(runtimeType,id,const DeepCollectionEquality().hash(_skills),bio,experienceYears,dayRateMinor,currency,base,serviceRadiusKm,const DeepCollectionEquality().hash(_portfolio),ratingAvg,ratingCount,jobsCompleted,isAvailable,isVerified);
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override
// Explains: Produce a readable diagnostic model representation for debugging.
String toString() {
    // Explains: Return the formatted model description including its current field values.
    return 'WorkerProfile(id: $id, skills: $skills, bio: $bio, experienceYears: $experienceYears, dayRateMinor: $dayRateMinor, currency: $currency, base: $base, serviceRadiusKm: $serviceRadiusKm, portfolio: $portfolio, ratingAvg: $ratingAvg, ratingCount: $ratingCount, jobsCompleted: $jobsCompleted, isAvailable: $isAvailable, isVerified: $isVerified)';
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}


// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

/// @nodoc
// Explains: Define generated immutable-copy support; change the model source rather than this helper.
abstract mixin class _$WorkerProfileCopyWith<$Res> implements $WorkerProfileCopyWith<$Res> {
  // Explains: Support immutable copies of this model; unspecified fields retain their current values.
  factory _$WorkerProfileCopyWith(_WorkerProfile value, $Res Function(_WorkerProfile) _then) = __$WorkerProfileCopyWithImpl;
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override @useResult
// Explains: Declare the generated copyWith call signature and replacement-field arguments.
$Res call({
 // Explains: Declare/configure id: the document identifier, supplied separately from Firestore data; skills: category IDs describing the worker skills; bio: the worker introduction; experienceYears: years of relevant experience; dayRateMinor: the daily rate in integer currency subunits; currency: the currency code, initially LKR; base: the worker base location; serviceRadiusKm: the maximum travel radius in kilometres; portfolio: the worker portfolio image URLs; ratingAvg: the server-maintained average rating; ratingCount: the server-maintained number of ratings; jobsCompleted: the server-maintained completed-job count; isAvailable: whether the worker is currently available; isVerified: the server-controlled verification flag.
 String id, List<String> skills, String bio, int experienceYears, int dayRateMinor, String currency, GeoLocation base, double serviceRadiusKm, List<String> portfolio, double ratingAvg, int ratingCount, int jobsCompleted, bool isAvailable, bool isVerified
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
});


// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override $GeoLocationCopyWith<$Res> get base;

// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
/// @nodoc
// Explains: Define generated immutable-copy support; change the model source rather than this helper.
class __$WorkerProfileCopyWithImpl<$Res>
    // Explains: Support immutable copies of this model; unspecified fields retain their current values.
    implements _$WorkerProfileCopyWith<$Res> {
  // Explains: Support immutable copies of this model; unspecified fields retain their current values.
  __$WorkerProfileCopyWithImpl(this._self, this._then);

  // Explains: Store the immutable model field or generated copy callback used by the methods below.
  final _WorkerProfile _self;
  // Explains: Store the callback that converts a copied model into the requested result type.
  final $Res Function(_WorkerProfile) _then;

/// Create a copy of WorkerProfile
/// with the given fields replaced by the non-null parameter values.
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? skills = null,Object? bio = null,Object? experienceYears = null,Object? dayRateMinor = null,Object? currency = null,Object? base = null,Object? serviceRadiusKm = null,Object? portfolio = null,Object? ratingAvg = null,Object? ratingCount = null,Object? jobsCompleted = null,Object? isAvailable = null,Object? isVerified = null,}) {
  // Explains: Pass the newly constructed immutable copy through the generated result callback.
  return _then(_WorkerProfile(
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as String,skills: null == skills ? _self._skills : skills // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as List<String>,bio: null == bio ? _self.bio : bio // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as String,experienceYears: null == experienceYears ? _self.experienceYears : experienceYears // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as int,dayRateMinor: null == dayRateMinor ? _self.dayRateMinor : dayRateMinor // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as int,currency: null == currency ? _self.currency : currency // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as String,base: null == base ? _self.base : base // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as GeoLocation,serviceRadiusKm: null == serviceRadiusKm ? _self.serviceRadiusKm : serviceRadiusKm // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as double,portfolio: null == portfolio ? _self._portfolio : portfolio // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as List<String>,ratingAvg: null == ratingAvg ? _self.ratingAvg : ratingAvg // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as double,ratingCount: null == ratingCount ? _self.ratingCount : ratingCount // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as int,jobsCompleted: null == jobsCompleted ? _self.jobsCompleted : jobsCompleted // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as int,isAvailable: null == isAvailable ? _self.isAvailable : isAvailable // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as bool,isVerified: null == isVerified ? _self.isVerified : isVerified // ignore: cast_nullable_to_non_nullable
// Explains: Cast the copied/deserialized value back to the declared field type after null/default handling.
as bool,
  // Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
  ));
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

/// Create a copy of WorkerProfile
/// with the given fields replaced by the non-null parameter values.
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override
// Explains: Give the Dart compiler an optimization hint for the following generated helper.
@pragma('vm:prefer-inline')
// Explains: Support immutable copies of this model; unspecified fields retain their current values.
$GeoLocationCopyWith<$Res> get base {
  
  // Explains: Support immutable copies of this model; unspecified fields retain their current values.
  return $GeoLocationCopyWith<$Res>(_self.base, (value) {
    // Explains: Pass the newly constructed immutable copy through the generated result callback.
    return _then(_self.copyWith(base: value));
  // Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
  });
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}


/// @nodoc
// Explains: Define the generated implementation/interface for the model; fields originate in models.dart.
mixin _$Category {

 // Explains: Declare/configure id: the document identifier, supplied separately from Firestore data; name: the display name shown to other users; nameEn: the English category label; nameSi: the Sinhala category label; nameTa: the Tamil category label; icon: the icon used to represent this item.
 String get id;@JsonKey(name: 'name_en') String get nameEn;@JsonKey(name: 'name_si') String get nameSi;@JsonKey(name: 'name_ta') String get nameTa; String get icon;
/// Create a copy of Category
/// with the given fields replaced by the non-null parameter values.
// Explains: Specify the persisted JSON key or whether the following member participates in serialization.
@JsonKey(includeFromJson: false, includeToJson: false)
// Explains: Give the Dart compiler an optimization hint for the following generated helper.
@pragma('vm:prefer-inline')
// Explains: Support immutable copies of this model; unspecified fields retain their current values.
$CategoryCopyWith<Category> get copyWith => _$CategoryCopyWithImpl<Category>(this as Category, _$identity);

  /// Serializes this Category to a JSON map.
  // Explains: Expose serialization of this immutable model through its generated field mapper.
  Map<String, dynamic> toJson();


// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override
// Explains: Compare model values instead of requiring both references to be the same object.
bool operator ==(Object other) {
  // Explains: View this generated mixin as its concrete model before accessing typed fields.
  final _this = this as Category;
  // Explains: Short-circuit identity matches, then compare the relevant generated model fields for equality.
  return identical(this, other) || (other.runtimeType == runtimeType&&other is Category&&(identical(other.id, _this.id) || other.id == _this.id)&&(identical(other.nameEn, _this.nameEn) || other.nameEn == _this.nameEn)&&(identical(other.nameSi, _this.nameSi) || other.nameSi == _this.nameSi)&&(identical(other.nameTa, _this.nameTa) || other.nameTa == _this.nameTa)&&(identical(other.icon, _this.icon) || other.icon == _this.icon));
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Specify the persisted JSON key or whether the following member participates in serialization.
@JsonKey(includeFromJson: false, includeToJson: false)
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override
// Explains: Compute a hash consistent with value equality so models work correctly in sets/maps.
int get hashCode {
  // Explains: View this generated mixin as its concrete model before accessing typed fields.
  final _this = this as Category;
  // Explains: Compute a hash consistent with value equality so models work correctly in sets/maps.
  return Object.hash(runtimeType,_this.id,_this.nameEn,_this.nameSi,_this.nameTa,_this.icon);
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override
// Explains: Produce a readable diagnostic model representation for debugging.
String toString() {
  // Explains: View this generated mixin as its concrete model before accessing typed fields.
  final _this = this as Category;
  // Explains: Return the formatted model description including its current field values.
  return 'Category(id: ${_this.id}, nameEn: ${_this.nameEn}, nameSi: ${_this.nameSi}, nameTa: ${_this.nameTa}, icon: ${_this.icon})';
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}


// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

/// @nodoc
// Explains: Define generated immutable-copy support; change the model source rather than this helper.
abstract mixin class $CategoryCopyWith<$Res>  {
  // Explains: Support immutable copies of this model; unspecified fields retain their current values.
  factory $CategoryCopyWith(Category value, $Res Function(Category) _then) = _$CategoryCopyWithImpl;
// Explains: Tell analysis tools that callers should use the returned copied value.
@useResult
// Explains: Declare the generated copyWith call signature and replacement-field arguments.
$Res call({
 // Explains: Declare/configure id: the document identifier, supplied separately from Firestore data; name: the display name shown to other users; nameEn: the English category label; nameSi: the Sinhala category label; nameTa: the Tamil category label; icon: the icon used to represent this item.
 String id,@JsonKey(name: 'name_en') String nameEn,@JsonKey(name: 'name_si') String nameSi,@JsonKey(name: 'name_ta') String nameTa, String icon
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
});




// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
/// @nodoc
// Explains: Define generated immutable-copy support; change the model source rather than this helper.
class _$CategoryCopyWithImpl<$Res>
    // Explains: Support immutable copies of this model; unspecified fields retain their current values.
    implements $CategoryCopyWith<$Res> {
  // Explains: Support immutable copies of this model; unspecified fields retain their current values.
  _$CategoryCopyWithImpl(this._self, this._then);

  // Explains: Store the immutable model field or generated copy callback used by the methods below.
  final Category _self;
  // Explains: Store the callback that converts a copied model into the requested result type.
  final $Res Function(Category) _then;

/// Create a copy of Category
/// with the given fields replaced by the non-null parameter values.
// Explains: Give the Dart compiler an optimization hint for the following generated helper.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? nameEn = null,Object? nameSi = null,Object? nameTa = null,Object? icon = null,}) {
  // Explains: Pass the newly constructed immutable copy through the generated result callback.
  return _then(Category(
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as String,nameEn: null == nameEn ? _self.nameEn : nameEn // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as String,nameSi: null == nameSi ? _self.nameSi : nameSi // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as String,nameTa: null == nameTa ? _self.nameTa : nameTa // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as String,icon: null == icon ? _self.icon : icon // ignore: cast_nullable_to_non_nullable
// Explains: Cast the copied/deserialized value back to the declared field type after null/default handling.
as String,
  // Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
  ));
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}


/// Adds pattern-matching-related methods to [Category].
// Explains: Group generated callbacks for matching this model variant and choosing a return value.
extension CategoryPatterns on Category {
/// A variant of `map` that fallback to returning `orElse`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

// Explains: Define generated pattern matching whose result type can be inferred by callers.
@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _Category value)?  $default,{required TResult orElse(),}){
// Explains: Capture the model instance for generated variant dispatch.
final _that = this;
// Explains: Choose the callback matching this generated model variant.
switch (_that) {
// Explains: Handle the matching model variant, or the fallback case when no typed callback applies.
case _Category() when $default != null:
// Explains: Invoke the callback with the matched model or its destructured fields and return its result.
return $default(_that);case _:
  // Explains: Run the caller fallback because the requested model callback does not apply.
  return orElse();

// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
/// A `switch`-like method, using callbacks.
///
/// Callbacks receives the raw object, upcasted.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case final Subclass2 value:
///     return ...;
/// }
/// ```

// Explains: Define generated pattern matching whose result type can be inferred by callers.
@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _Category value)  $default,){
// Explains: Capture the model instance for generated variant dispatch.
final _that = this;
// Explains: Choose the callback matching this generated model variant.
switch (_that) {
// Explains: Handle the matching model variant, or the fallback case when no typed callback applies.
case _Category():
// Explains: Invoke the callback with the matched model or its destructured fields and return its result.
return $default(_that);case _:
  // Explains: Stop this operation with an explicit error because the input or model variant is unsupported.
  throw StateError('Unexpected subclass');

// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
/// A variant of `map` that fallback to returning `null`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return null;
/// }
/// ```

// Explains: Define generated pattern matching whose result type can be inferred by callers.
@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _Category value)?  $default,){
// Explains: Capture the model instance for generated variant dispatch.
final _that = this;
// Explains: Choose the callback matching this generated model variant.
switch (_that) {
// Explains: Handle the matching model variant, or the fallback case when no typed callback applies.
case _Category() when $default != null:
// Explains: Invoke the callback with the matched model or its destructured fields and return its result.
return $default(_that);case _:
  // Explains: Return no result/error; callers interpret null according to this method contract.
  return null;

// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
/// A variant of `when` that fallback to an `orElse` callback.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

// Explains: Define generated pattern matching whose result type can be inferred by callers.
@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id, @JsonKey(name: 'name_en')  String nameEn, @JsonKey(name: 'name_si')  String nameSi, @JsonKey(name: 'name_ta')  String nameTa,  String icon)?  $default,{required TResult orElse(),}) {final _that = this;
// Explains: Choose the callback matching this generated model variant.
switch (_that) {
// Explains: Handle the matching model variant, or the fallback case when no typed callback applies.
case _Category() when $default != null:
// Explains: Invoke the callback with the matched model or its destructured fields and return its result.
return $default(_that.id,_that.nameEn,_that.nameSi,_that.nameTa,_that.icon);case _:
  // Explains: Run the caller fallback because the requested model callback does not apply.
  return orElse();

// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
/// A `switch`-like method, using callbacks.
///
/// As opposed to `map`, this offers destructuring.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case Subclass2(:final field2):
///     return ...;
/// }
/// ```

// Explains: Define generated pattern matching whose result type can be inferred by callers.
@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id, @JsonKey(name: 'name_en')  String nameEn, @JsonKey(name: 'name_si')  String nameSi, @JsonKey(name: 'name_ta')  String nameTa,  String icon)  $default,) {final _that = this;
// Explains: Choose the callback matching this generated model variant.
switch (_that) {
// Explains: Handle the matching model variant, or the fallback case when no typed callback applies.
case _Category():
// Explains: Invoke the callback with the matched model or its destructured fields and return its result.
return $default(_that.id,_that.nameEn,_that.nameSi,_that.nameTa,_that.icon);case _:
  // Explains: Stop this operation with an explicit error because the input or model variant is unsupported.
  throw StateError('Unexpected subclass');

// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
/// A variant of `when` that fallback to returning `null`
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return null;
/// }
/// ```

// Explains: Define generated pattern matching whose result type can be inferred by callers.
@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id, @JsonKey(name: 'name_en')  String nameEn, @JsonKey(name: 'name_si')  String nameSi, @JsonKey(name: 'name_ta')  String nameTa,  String icon)?  $default,) {final _that = this;
// Explains: Choose the callback matching this generated model variant.
switch (_that) {
// Explains: Handle the matching model variant, or the fallback case when no typed callback applies.
case _Category() when $default != null:
// Explains: Invoke the callback with the matched model or its destructured fields and return its result.
return $default(_that.id,_that.nameEn,_that.nameSi,_that.nameTa,_that.icon);case _:
  // Explains: Return no result/error; callers interpret null according to this method contract.
  return null;

// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

/// @nodoc
// Explains: Generate the field-to-JSON and JSON-to-field mapping for this concrete immutable model.
@JsonSerializable()

// Explains: Define the generated implementation/interface for the model; fields originate in models.dart.
class _Category extends Category {
  // Explains: Declare/configure id: the document identifier, supplied separately from Firestore data; name: the display name shown to other users; nameEn: the English category label; nameSi: the Sinhala category label; nameTa: the Tamil category label; icon: the icon used to represent this item.
  const _Category({required this.id, @JsonKey(name: 'name_en') required this.nameEn, @JsonKey(name: 'name_si') this.nameSi = '', @JsonKey(name: 'name_ta') this.nameTa = '', required this.icon}): super._();
  // Explains: Delegate field parsing to the generated JSON deserializer for this model.
  factory _Category.fromJson(Map<String, dynamic> json) => _$CategoryFromJson(json);

// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override final  String id;
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override@JsonKey(name: 'name_en') final  String nameEn;
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override@JsonKey(name: 'name_si') final  String nameSi;
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override@JsonKey(name: 'name_ta') final  String nameTa;
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override final  String icon;

/// Create a copy of Category
/// with the given fields replaced by the non-null parameter values.
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override @JsonKey(includeFromJson: false, includeToJson: false)
// Explains: Give the Dart compiler an optimization hint for the following generated helper.
@pragma('vm:prefer-inline')
// Explains: Support immutable copies of this model; unspecified fields retain their current values.
_$CategoryCopyWith<_Category> get copyWith => __$CategoryCopyWithImpl<_Category>(this, _$identity);

// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override
// Explains: Expose serialization of this immutable model through its generated field mapper.
Map<String, dynamic> toJson() {
  // Explains: Map between this generated concrete model and its serialized field representation.
  return _$CategoryToJson(this, );
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override
// Explains: Compare model values instead of requiring both references to be the same object.
bool operator ==(Object other) {
    // Explains: Short-circuit identity matches, then compare the relevant generated model fields for equality.
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _Category&&(identical(other.id, id) || other.id == id)&&(identical(other.nameEn, nameEn) || other.nameEn == nameEn)&&(identical(other.nameSi, nameSi) || other.nameSi == nameSi)&&(identical(other.nameTa, nameTa) || other.nameTa == nameTa)&&(identical(other.icon, icon) || other.icon == icon));
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Specify the persisted JSON key or whether the following member participates in serialization.
@JsonKey(includeFromJson: false, includeToJson: false)
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override
// Explains: Compute a hash consistent with value equality so models work correctly in sets/maps.
int get hashCode {
    // Explains: Compute a hash consistent with value equality so models work correctly in sets/maps.
    return Object.hash(runtimeType,id,nameEn,nameSi,nameTa,icon);
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override
// Explains: Produce a readable diagnostic model representation for debugging.
String toString() {
    // Explains: Return the formatted model description including its current field values.
    return 'Category(id: $id, nameEn: $nameEn, nameSi: $nameSi, nameTa: $nameTa, icon: $icon)';
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}


// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

/// @nodoc
// Explains: Define generated immutable-copy support; change the model source rather than this helper.
abstract mixin class _$CategoryCopyWith<$Res> implements $CategoryCopyWith<$Res> {
  // Explains: Support immutable copies of this model; unspecified fields retain their current values.
  factory _$CategoryCopyWith(_Category value, $Res Function(_Category) _then) = __$CategoryCopyWithImpl;
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override @useResult
// Explains: Declare the generated copyWith call signature and replacement-field arguments.
$Res call({
 // Explains: Declare/configure id: the document identifier, supplied separately from Firestore data; name: the display name shown to other users; nameEn: the English category label; nameSi: the Sinhala category label; nameTa: the Tamil category label; icon: the icon used to represent this item.
 String id,@JsonKey(name: 'name_en') String nameEn,@JsonKey(name: 'name_si') String nameSi,@JsonKey(name: 'name_ta') String nameTa, String icon
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
});




// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
/// @nodoc
// Explains: Define generated immutable-copy support; change the model source rather than this helper.
class __$CategoryCopyWithImpl<$Res>
    // Explains: Support immutable copies of this model; unspecified fields retain their current values.
    implements _$CategoryCopyWith<$Res> {
  // Explains: Support immutable copies of this model; unspecified fields retain their current values.
  __$CategoryCopyWithImpl(this._self, this._then);

  // Explains: Store the immutable model field or generated copy callback used by the methods below.
  final _Category _self;
  // Explains: Store the callback that converts a copied model into the requested result type.
  final $Res Function(_Category) _then;

/// Create a copy of Category
/// with the given fields replaced by the non-null parameter values.
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? nameEn = null,Object? nameSi = null,Object? nameTa = null,Object? icon = null,}) {
  // Explains: Pass the newly constructed immutable copy through the generated result callback.
  return _then(_Category(
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as String,nameEn: null == nameEn ? _self.nameEn : nameEn // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as String,nameSi: null == nameSi ? _self.nameSi : nameSi // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as String,nameTa: null == nameTa ? _self.nameTa : nameTa // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as String,icon: null == icon ? _self.icon : icon // ignore: cast_nullable_to_non_nullable
// Explains: Cast the copied/deserialized value back to the declared field type after null/default handling.
as String,
  // Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
  ));
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}


// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}


/// @nodoc
// Explains: Define the generated implementation/interface for the model; fields originate in models.dart.
mixin _$Job {

 // Explains: Declare/configure id: the document identifier, supplied separately from Firestore data; geo: the location used for nearby matching; createdAt: the creation time stored in UTC; currency: the currency code, initially LKR; clientId: the UID of the client who owns the job; title: the visible title; description: the description of the requested work; categoryId: the category used for skill matching; photos: the job photo URLs; budgetMinMinor: the lower budget in integer currency subunits; budgetMaxMinor: the upper budget in integer currency subunits; addressText: the human-readable work address; preferredDate: the preferred work date; status: the persisted lifecycle state; assignedWorkerId: the selected worker UID, absent before assignment; applicationCount: the server-maintained quote count; completionRequested: whether the worker has requested client confirmation.
 String get id; String get clientId; String get title; String get description; String get categoryId; List<String> get photos; int get budgetMinMinor; int get budgetMaxMinor; String get currency; GeoLocation get geo; String get addressText;@FirestoreDate() DateTime get preferredDate; JobStatus get status; String? get assignedWorkerId; int get applicationCount; bool get completionRequested;@FirestoreDate() DateTime get createdAt;
/// Create a copy of Job
/// with the given fields replaced by the non-null parameter values.
// Explains: Specify the persisted JSON key or whether the following member participates in serialization.
@JsonKey(includeFromJson: false, includeToJson: false)
// Explains: Give the Dart compiler an optimization hint for the following generated helper.
@pragma('vm:prefer-inline')
// Explains: Support immutable copies of this model; unspecified fields retain their current values.
$JobCopyWith<Job> get copyWith => _$JobCopyWithImpl<Job>(this as Job, _$identity);

  /// Serializes this Job to a JSON map.
  // Explains: Expose serialization of this immutable model through its generated field mapper.
  Map<String, dynamic> toJson();


// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override
// Explains: Compare model values instead of requiring both references to be the same object.
bool operator ==(Object other) {
  // Explains: View this generated mixin as its concrete model before accessing typed fields.
  final _this = this as Job;
  // Explains: Short-circuit identity matches, then compare the relevant generated model fields for equality.
  return identical(this, other) || (other.runtimeType == runtimeType&&other is Job&&(identical(other.id, _this.id) || other.id == _this.id)&&(identical(other.clientId, _this.clientId) || other.clientId == _this.clientId)&&(identical(other.title, _this.title) || other.title == _this.title)&&(identical(other.description, _this.description) || other.description == _this.description)&&(identical(other.categoryId, _this.categoryId) || other.categoryId == _this.categoryId)&&const DeepCollectionEquality().equals(other.photos, _this.photos)&&(identical(other.budgetMinMinor, _this.budgetMinMinor) || other.budgetMinMinor == _this.budgetMinMinor)&&(identical(other.budgetMaxMinor, _this.budgetMaxMinor) || other.budgetMaxMinor == _this.budgetMaxMinor)&&(identical(other.currency, _this.currency) || other.currency == _this.currency)&&(identical(other.geo, _this.geo) || other.geo == _this.geo)&&(identical(other.addressText, _this.addressText) || other.addressText == _this.addressText)&&(identical(other.preferredDate, _this.preferredDate) || other.preferredDate == _this.preferredDate)&&(identical(other.status, _this.status) || other.status == _this.status)&&(identical(other.assignedWorkerId, _this.assignedWorkerId) || other.assignedWorkerId == _this.assignedWorkerId)&&(identical(other.applicationCount, _this.applicationCount) || other.applicationCount == _this.applicationCount)&&(identical(other.completionRequested, _this.completionRequested) || other.completionRequested == _this.completionRequested)&&(identical(other.createdAt, _this.createdAt) || other.createdAt == _this.createdAt));
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Specify the persisted JSON key or whether the following member participates in serialization.
@JsonKey(includeFromJson: false, includeToJson: false)
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override
// Explains: Compute a hash consistent with value equality so models work correctly in sets/maps.
int get hashCode {
  // Explains: View this generated mixin as its concrete model before accessing typed fields.
  final _this = this as Job;
  // Explains: Compute a hash consistent with value equality so models work correctly in sets/maps.
  return Object.hash(runtimeType,_this.id,_this.clientId,_this.title,_this.description,_this.categoryId,const DeepCollectionEquality().hash(_this.photos),_this.budgetMinMinor,_this.budgetMaxMinor,_this.currency,_this.geo,_this.addressText,_this.preferredDate,_this.status,_this.assignedWorkerId,_this.applicationCount,_this.completionRequested,_this.createdAt);
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override
// Explains: Produce a readable diagnostic model representation for debugging.
String toString() {
  // Explains: View this generated mixin as its concrete model before accessing typed fields.
  final _this = this as Job;
  // Explains: Return the formatted model description including its current field values.
  return 'Job(id: ${_this.id}, clientId: ${_this.clientId}, title: ${_this.title}, description: ${_this.description}, categoryId: ${_this.categoryId}, photos: ${_this.photos}, budgetMinMinor: ${_this.budgetMinMinor}, budgetMaxMinor: ${_this.budgetMaxMinor}, currency: ${_this.currency}, geo: ${_this.geo}, addressText: ${_this.addressText}, preferredDate: ${_this.preferredDate}, status: ${_this.status}, assignedWorkerId: ${_this.assignedWorkerId}, applicationCount: ${_this.applicationCount}, completionRequested: ${_this.completionRequested}, createdAt: ${_this.createdAt})';
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}


// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

/// @nodoc
// Explains: Define generated immutable-copy support; change the model source rather than this helper.
abstract mixin class $JobCopyWith<$Res>  {
  // Explains: Support immutable copies of this model; unspecified fields retain their current values.
  factory $JobCopyWith(Job value, $Res Function(Job) _then) = _$JobCopyWithImpl;
// Explains: Tell analysis tools that callers should use the returned copied value.
@useResult
// Explains: Declare the generated copyWith call signature and replacement-field arguments.
$Res call({
 // Explains: Declare/configure id: the document identifier, supplied separately from Firestore data; geo: the location used for nearby matching; createdAt: the creation time stored in UTC; currency: the currency code, initially LKR; clientId: the UID of the client who owns the job; title: the visible title; description: the description of the requested work; categoryId: the category used for skill matching; photos: the job photo URLs; budgetMinMinor: the lower budget in integer currency subunits; budgetMaxMinor: the upper budget in integer currency subunits; addressText: the human-readable work address; preferredDate: the preferred work date; status: the persisted lifecycle state; assignedWorkerId: the selected worker UID, absent before assignment; applicationCount: the server-maintained quote count; completionRequested: whether the worker has requested client confirmation.
 String id, String clientId, String title, String description, String categoryId, List<String> photos, int budgetMinMinor, int budgetMaxMinor, String currency, GeoLocation geo, String addressText,@FirestoreDate() DateTime preferredDate, JobStatus status, String? assignedWorkerId, int applicationCount, bool completionRequested,@FirestoreDate() DateTime createdAt
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
});


// Explains: Support immutable copies of this model; unspecified fields retain their current values.
$GeoLocationCopyWith<$Res> get geo;

// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
/// @nodoc
// Explains: Define generated immutable-copy support; change the model source rather than this helper.
class _$JobCopyWithImpl<$Res>
    // Explains: Support immutable copies of this model; unspecified fields retain their current values.
    implements $JobCopyWith<$Res> {
  // Explains: Support immutable copies of this model; unspecified fields retain their current values.
  _$JobCopyWithImpl(this._self, this._then);

  // Explains: Store the immutable model field or generated copy callback used by the methods below.
  final Job _self;
  // Explains: Store the callback that converts a copied model into the requested result type.
  final $Res Function(Job) _then;

/// Create a copy of Job
/// with the given fields replaced by the non-null parameter values.
// Explains: Give the Dart compiler an optimization hint for the following generated helper.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? clientId = null,Object? title = null,Object? description = null,Object? categoryId = null,Object? photos = null,Object? budgetMinMinor = null,Object? budgetMaxMinor = null,Object? currency = null,Object? geo = null,Object? addressText = null,Object? preferredDate = null,Object? status = null,Object? assignedWorkerId = freezed,Object? applicationCount = null,Object? completionRequested = null,Object? createdAt = null,}) {
  // Explains: Pass the newly constructed immutable copy through the generated result callback.
  return _then(Job(
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as String,clientId: null == clientId ? _self.clientId : clientId // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as String,title: null == title ? _self.title : title // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as String,description: null == description ? _self.description : description // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as String,categoryId: null == categoryId ? _self.categoryId : categoryId // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as String,photos: null == photos ? _self.photos : photos // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as List<String>,budgetMinMinor: null == budgetMinMinor ? _self.budgetMinMinor : budgetMinMinor // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as int,budgetMaxMinor: null == budgetMaxMinor ? _self.budgetMaxMinor : budgetMaxMinor // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as int,currency: null == currency ? _self.currency : currency // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as String,geo: null == geo ? _self.geo : geo // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as GeoLocation,addressText: null == addressText ? _self.addressText : addressText // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as String,preferredDate: null == preferredDate ? _self.preferredDate : preferredDate // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as DateTime,status: null == status ? _self.status : status // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as JobStatus,assignedWorkerId: freezed == assignedWorkerId ? _self.assignedWorkerId : assignedWorkerId // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as String?,applicationCount: null == applicationCount ? _self.applicationCount : applicationCount // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as int,completionRequested: null == completionRequested ? _self.completionRequested : completionRequested // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as bool,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
// Explains: Cast the copied/deserialized value back to the declared field type after null/default handling.
as DateTime,
  // Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
  ));
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
/// Create a copy of Job
/// with the given fields replaced by the non-null parameter values.
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override
// Explains: Give the Dart compiler an optimization hint for the following generated helper.
@pragma('vm:prefer-inline')
// Explains: Support immutable copies of this model; unspecified fields retain their current values.
$GeoLocationCopyWith<$Res> get geo {
  
  // Explains: Support immutable copies of this model; unspecified fields retain their current values.
  return $GeoLocationCopyWith<$Res>(_self.geo, (value) {
    // Explains: Pass the newly constructed immutable copy through the generated result callback.
    return _then(_self.copyWith(geo: value));
  // Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
  });
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}


/// Adds pattern-matching-related methods to [Job].
// Explains: Group generated callbacks for matching this model variant and choosing a return value.
extension JobPatterns on Job {
/// A variant of `map` that fallback to returning `orElse`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

// Explains: Define generated pattern matching whose result type can be inferred by callers.
@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _Job value)?  $default,{required TResult orElse(),}){
// Explains: Capture the model instance for generated variant dispatch.
final _that = this;
// Explains: Choose the callback matching this generated model variant.
switch (_that) {
// Explains: Handle the matching model variant, or the fallback case when no typed callback applies.
case _Job() when $default != null:
// Explains: Invoke the callback with the matched model or its destructured fields and return its result.
return $default(_that);case _:
  // Explains: Run the caller fallback because the requested model callback does not apply.
  return orElse();

// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
/// A `switch`-like method, using callbacks.
///
/// Callbacks receives the raw object, upcasted.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case final Subclass2 value:
///     return ...;
/// }
/// ```

// Explains: Define generated pattern matching whose result type can be inferred by callers.
@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _Job value)  $default,){
// Explains: Capture the model instance for generated variant dispatch.
final _that = this;
// Explains: Choose the callback matching this generated model variant.
switch (_that) {
// Explains: Handle the matching model variant, or the fallback case when no typed callback applies.
case _Job():
// Explains: Invoke the callback with the matched model or its destructured fields and return its result.
return $default(_that);case _:
  // Explains: Stop this operation with an explicit error because the input or model variant is unsupported.
  throw StateError('Unexpected subclass');

// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
/// A variant of `map` that fallback to returning `null`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return null;
/// }
/// ```

// Explains: Define generated pattern matching whose result type can be inferred by callers.
@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _Job value)?  $default,){
// Explains: Capture the model instance for generated variant dispatch.
final _that = this;
// Explains: Choose the callback matching this generated model variant.
switch (_that) {
// Explains: Handle the matching model variant, or the fallback case when no typed callback applies.
case _Job() when $default != null:
// Explains: Invoke the callback with the matched model or its destructured fields and return its result.
return $default(_that);case _:
  // Explains: Return no result/error; callers interpret null according to this method contract.
  return null;

// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
/// A variant of `when` that fallback to an `orElse` callback.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

// Explains: Define generated pattern matching whose result type can be inferred by callers.
@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id,  String clientId,  String title,  String description,  String categoryId,  List<String> photos,  int budgetMinMinor,  int budgetMaxMinor,  String currency,  GeoLocation geo,  String addressText, @FirestoreDate()  DateTime preferredDate,  JobStatus status,  String? assignedWorkerId,  int applicationCount,  bool completionRequested, @FirestoreDate()  DateTime createdAt)?  $default,{required TResult orElse(),}) {final _that = this;
// Explains: Choose the callback matching this generated model variant.
switch (_that) {
// Explains: Handle the matching model variant, or the fallback case when no typed callback applies.
case _Job() when $default != null:
// Explains: Invoke the callback with the matched model or its destructured fields and return its result.
return $default(_that.id,_that.clientId,_that.title,_that.description,_that.categoryId,_that.photos,_that.budgetMinMinor,_that.budgetMaxMinor,_that.currency,_that.geo,_that.addressText,_that.preferredDate,_that.status,_that.assignedWorkerId,_that.applicationCount,_that.completionRequested,_that.createdAt);case _:
  // Explains: Run the caller fallback because the requested model callback does not apply.
  return orElse();

// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
/// A `switch`-like method, using callbacks.
///
/// As opposed to `map`, this offers destructuring.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case Subclass2(:final field2):
///     return ...;
/// }
/// ```

// Explains: Define generated pattern matching whose result type can be inferred by callers.
@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id,  String clientId,  String title,  String description,  String categoryId,  List<String> photos,  int budgetMinMinor,  int budgetMaxMinor,  String currency,  GeoLocation geo,  String addressText, @FirestoreDate()  DateTime preferredDate,  JobStatus status,  String? assignedWorkerId,  int applicationCount,  bool completionRequested, @FirestoreDate()  DateTime createdAt)  $default,) {final _that = this;
// Explains: Choose the callback matching this generated model variant.
switch (_that) {
// Explains: Handle the matching model variant, or the fallback case when no typed callback applies.
case _Job():
// Explains: Invoke the callback with the matched model or its destructured fields and return its result.
return $default(_that.id,_that.clientId,_that.title,_that.description,_that.categoryId,_that.photos,_that.budgetMinMinor,_that.budgetMaxMinor,_that.currency,_that.geo,_that.addressText,_that.preferredDate,_that.status,_that.assignedWorkerId,_that.applicationCount,_that.completionRequested,_that.createdAt);case _:
  // Explains: Stop this operation with an explicit error because the input or model variant is unsupported.
  throw StateError('Unexpected subclass');

// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
/// A variant of `when` that fallback to returning `null`
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return null;
/// }
/// ```

// Explains: Define generated pattern matching whose result type can be inferred by callers.
@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id,  String clientId,  String title,  String description,  String categoryId,  List<String> photos,  int budgetMinMinor,  int budgetMaxMinor,  String currency,  GeoLocation geo,  String addressText, @FirestoreDate()  DateTime preferredDate,  JobStatus status,  String? assignedWorkerId,  int applicationCount,  bool completionRequested, @FirestoreDate()  DateTime createdAt)?  $default,) {final _that = this;
// Explains: Choose the callback matching this generated model variant.
switch (_that) {
// Explains: Handle the matching model variant, or the fallback case when no typed callback applies.
case _Job() when $default != null:
// Explains: Invoke the callback with the matched model or its destructured fields and return its result.
return $default(_that.id,_that.clientId,_that.title,_that.description,_that.categoryId,_that.photos,_that.budgetMinMinor,_that.budgetMaxMinor,_that.currency,_that.geo,_that.addressText,_that.preferredDate,_that.status,_that.assignedWorkerId,_that.applicationCount,_that.completionRequested,_that.createdAt);case _:
  // Explains: Return no result/error; callers interpret null according to this method contract.
  return null;

// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

/// @nodoc
// Explains: Generate the field-to-JSON and JSON-to-field mapping for this concrete immutable model.
@JsonSerializable()

// Explains: Define the generated implementation/interface for the model; fields originate in models.dart.
class _Job extends Job {
  // Explains: Declare/configure id: the document identifier, supplied separately from Firestore data; geo: the location used for nearby matching; createdAt: the creation time stored in UTC; currency: the currency code, initially LKR; clientId: the UID of the client who owns the job; title: the visible title; description: the description of the requested work; categoryId: the category used for skill matching; photos: the job photo URLs; budgetMinMinor: the lower budget in integer currency subunits; budgetMaxMinor: the upper budget in integer currency subunits; addressText: the human-readable work address; preferredDate: the preferred work date; status: the persisted lifecycle state; assignedWorkerId: the selected worker UID, absent before assignment; applicationCount: the server-maintained quote count; completionRequested: whether the worker has requested client confirmation.
  const _Job({required this.id, required this.clientId, required this.title, required this.description, required this.categoryId,  List<String> photos = const [], required this.budgetMinMinor, required this.budgetMaxMinor, this.currency = 'LKR', required this.geo, required this.addressText, @FirestoreDate() required this.preferredDate, this.status = JobStatus.draft, this.assignedWorkerId, this.applicationCount = 0, this.completionRequested = false, @FirestoreDate() required this.createdAt}): _photos = photos,super._();
  // Explains: Delegate field parsing to the generated JSON deserializer for this model.
  factory _Job.fromJson(Map<String, dynamic> json) => _$JobFromJson(json);

// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override final  String id;
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override final  String clientId;
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override final  String title;
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override final  String description;
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override final  String categoryId;
 // Explains: Store the immutable model field or generated copy callback used by the methods below.
 final  List<String> _photos;
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override@JsonKey() List<String> get photos {
  // Explains: Expose collection values through an unmodifiable view to preserve model immutability.
  if (_photos is EqualUnmodifiableListView) return _photos;
  // ignore: implicit_dynamic_type
  // Explains: Expose collection values through an unmodifiable view to preserve model immutability.
  return EqualUnmodifiableListView(_photos);
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override final  int budgetMinMinor;
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override final  int budgetMaxMinor;
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override@JsonKey() final  String currency;
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override final  GeoLocation geo;
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override final  String addressText;
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override@FirestoreDate() final  DateTime preferredDate;
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override@JsonKey() final  JobStatus status;
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override final  String? assignedWorkerId;
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override@JsonKey() final  int applicationCount;
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override@JsonKey() final  bool completionRequested;
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override@FirestoreDate() final  DateTime createdAt;

/// Create a copy of Job
/// with the given fields replaced by the non-null parameter values.
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override @JsonKey(includeFromJson: false, includeToJson: false)
// Explains: Give the Dart compiler an optimization hint for the following generated helper.
@pragma('vm:prefer-inline')
// Explains: Support immutable copies of this model; unspecified fields retain their current values.
_$JobCopyWith<_Job> get copyWith => __$JobCopyWithImpl<_Job>(this, _$identity);

// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override
// Explains: Expose serialization of this immutable model through its generated field mapper.
Map<String, dynamic> toJson() {
  // Explains: Map between this generated concrete model and its serialized field representation.
  return _$JobToJson(this, );
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override
// Explains: Compare model values instead of requiring both references to be the same object.
bool operator ==(Object other) {
    // Explains: Short-circuit identity matches, then compare the relevant generated model fields for equality.
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _Job&&(identical(other.id, id) || other.id == id)&&(identical(other.clientId, clientId) || other.clientId == clientId)&&(identical(other.title, title) || other.title == title)&&(identical(other.description, description) || other.description == description)&&(identical(other.categoryId, categoryId) || other.categoryId == categoryId)&&const DeepCollectionEquality().equals(other.photos, _photos)&&(identical(other.budgetMinMinor, budgetMinMinor) || other.budgetMinMinor == budgetMinMinor)&&(identical(other.budgetMaxMinor, budgetMaxMinor) || other.budgetMaxMinor == budgetMaxMinor)&&(identical(other.currency, currency) || other.currency == currency)&&(identical(other.geo, geo) || other.geo == geo)&&(identical(other.addressText, addressText) || other.addressText == addressText)&&(identical(other.preferredDate, preferredDate) || other.preferredDate == preferredDate)&&(identical(other.status, status) || other.status == status)&&(identical(other.assignedWorkerId, assignedWorkerId) || other.assignedWorkerId == assignedWorkerId)&&(identical(other.applicationCount, applicationCount) || other.applicationCount == applicationCount)&&(identical(other.completionRequested, completionRequested) || other.completionRequested == completionRequested)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt));
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Specify the persisted JSON key or whether the following member participates in serialization.
@JsonKey(includeFromJson: false, includeToJson: false)
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override
// Explains: Compute a hash consistent with value equality so models work correctly in sets/maps.
int get hashCode {
    // Explains: Compute a hash consistent with value equality so models work correctly in sets/maps.
    return Object.hash(runtimeType,id,clientId,title,description,categoryId,const DeepCollectionEquality().hash(_photos),budgetMinMinor,budgetMaxMinor,currency,geo,addressText,preferredDate,status,assignedWorkerId,applicationCount,completionRequested,createdAt);
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override
// Explains: Produce a readable diagnostic model representation for debugging.
String toString() {
    // Explains: Return the formatted model description including its current field values.
    return 'Job(id: $id, clientId: $clientId, title: $title, description: $description, categoryId: $categoryId, photos: $photos, budgetMinMinor: $budgetMinMinor, budgetMaxMinor: $budgetMaxMinor, currency: $currency, geo: $geo, addressText: $addressText, preferredDate: $preferredDate, status: $status, assignedWorkerId: $assignedWorkerId, applicationCount: $applicationCount, completionRequested: $completionRequested, createdAt: $createdAt)';
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}


// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

/// @nodoc
// Explains: Define generated immutable-copy support; change the model source rather than this helper.
abstract mixin class _$JobCopyWith<$Res> implements $JobCopyWith<$Res> {
  // Explains: Support immutable copies of this model; unspecified fields retain their current values.
  factory _$JobCopyWith(_Job value, $Res Function(_Job) _then) = __$JobCopyWithImpl;
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override @useResult
// Explains: Declare the generated copyWith call signature and replacement-field arguments.
$Res call({
 // Explains: Declare/configure id: the document identifier, supplied separately from Firestore data; geo: the location used for nearby matching; createdAt: the creation time stored in UTC; currency: the currency code, initially LKR; clientId: the UID of the client who owns the job; title: the visible title; description: the description of the requested work; categoryId: the category used for skill matching; photos: the job photo URLs; budgetMinMinor: the lower budget in integer currency subunits; budgetMaxMinor: the upper budget in integer currency subunits; addressText: the human-readable work address; preferredDate: the preferred work date; status: the persisted lifecycle state; assignedWorkerId: the selected worker UID, absent before assignment; applicationCount: the server-maintained quote count; completionRequested: whether the worker has requested client confirmation.
 String id, String clientId, String title, String description, String categoryId, List<String> photos, int budgetMinMinor, int budgetMaxMinor, String currency, GeoLocation geo, String addressText,@FirestoreDate() DateTime preferredDate, JobStatus status, String? assignedWorkerId, int applicationCount, bool completionRequested,@FirestoreDate() DateTime createdAt
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
});


// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override $GeoLocationCopyWith<$Res> get geo;

// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
/// @nodoc
// Explains: Define generated immutable-copy support; change the model source rather than this helper.
class __$JobCopyWithImpl<$Res>
    // Explains: Support immutable copies of this model; unspecified fields retain their current values.
    implements _$JobCopyWith<$Res> {
  // Explains: Support immutable copies of this model; unspecified fields retain their current values.
  __$JobCopyWithImpl(this._self, this._then);

  // Explains: Store the immutable model field or generated copy callback used by the methods below.
  final _Job _self;
  // Explains: Store the callback that converts a copied model into the requested result type.
  final $Res Function(_Job) _then;

/// Create a copy of Job
/// with the given fields replaced by the non-null parameter values.
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? clientId = null,Object? title = null,Object? description = null,Object? categoryId = null,Object? photos = null,Object? budgetMinMinor = null,Object? budgetMaxMinor = null,Object? currency = null,Object? geo = null,Object? addressText = null,Object? preferredDate = null,Object? status = null,Object? assignedWorkerId = freezed,Object? applicationCount = null,Object? completionRequested = null,Object? createdAt = null,}) {
  // Explains: Pass the newly constructed immutable copy through the generated result callback.
  return _then(_Job(
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as String,clientId: null == clientId ? _self.clientId : clientId // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as String,title: null == title ? _self.title : title // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as String,description: null == description ? _self.description : description // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as String,categoryId: null == categoryId ? _self.categoryId : categoryId // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as String,photos: null == photos ? _self._photos : photos // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as List<String>,budgetMinMinor: null == budgetMinMinor ? _self.budgetMinMinor : budgetMinMinor // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as int,budgetMaxMinor: null == budgetMaxMinor ? _self.budgetMaxMinor : budgetMaxMinor // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as int,currency: null == currency ? _self.currency : currency // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as String,geo: null == geo ? _self.geo : geo // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as GeoLocation,addressText: null == addressText ? _self.addressText : addressText // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as String,preferredDate: null == preferredDate ? _self.preferredDate : preferredDate // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as DateTime,status: null == status ? _self.status : status // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as JobStatus,assignedWorkerId: freezed == assignedWorkerId ? _self.assignedWorkerId : assignedWorkerId // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as String?,applicationCount: null == applicationCount ? _self.applicationCount : applicationCount // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as int,completionRequested: null == completionRequested ? _self.completionRequested : completionRequested // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as bool,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
// Explains: Cast the copied/deserialized value back to the declared field type after null/default handling.
as DateTime,
  // Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
  ));
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

/// Create a copy of Job
/// with the given fields replaced by the non-null parameter values.
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override
// Explains: Give the Dart compiler an optimization hint for the following generated helper.
@pragma('vm:prefer-inline')
// Explains: Support immutable copies of this model; unspecified fields retain their current values.
$GeoLocationCopyWith<$Res> get geo {
  
  // Explains: Support immutable copies of this model; unspecified fields retain their current values.
  return $GeoLocationCopyWith<$Res>(_self.geo, (value) {
    // Explains: Pass the newly constructed immutable copy through the generated result callback.
    return _then(_self.copyWith(geo: value));
  // Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
  });
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}


/// @nodoc
// Explains: Define the generated implementation/interface for the model; fields originate in models.dart.
mixin _$Application {

 // Explains: Declare/configure id: the document identifier, supplied separately from Firestore data; createdAt: the creation time stored in UTC; currency: the currency code, initially LKR; status: the persisted lifecycle state; jobId: the job linking this record to the marketplace lifecycle; workerId: the UID of the worker submitting the quote; message: the text displayed or sent for this item; quotedPriceMinor: the quote in integer currency subunits.
 String get id; String get jobId; String get workerId; String get message; int get quotedPriceMinor; String get currency; ApplicationStatus get status;@FirestoreDate() DateTime get createdAt;
/// Create a copy of Application
/// with the given fields replaced by the non-null parameter values.
// Explains: Specify the persisted JSON key or whether the following member participates in serialization.
@JsonKey(includeFromJson: false, includeToJson: false)
// Explains: Give the Dart compiler an optimization hint for the following generated helper.
@pragma('vm:prefer-inline')
// Explains: Support immutable copies of this model; unspecified fields retain their current values.
$ApplicationCopyWith<Application> get copyWith => _$ApplicationCopyWithImpl<Application>(this as Application, _$identity);

  /// Serializes this Application to a JSON map.
  // Explains: Expose serialization of this immutable model through its generated field mapper.
  Map<String, dynamic> toJson();


// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override
// Explains: Compare model values instead of requiring both references to be the same object.
bool operator ==(Object other) {
  // Explains: View this generated mixin as its concrete model before accessing typed fields.
  final _this = this as Application;
  // Explains: Short-circuit identity matches, then compare the relevant generated model fields for equality.
  return identical(this, other) || (other.runtimeType == runtimeType&&other is Application&&(identical(other.id, _this.id) || other.id == _this.id)&&(identical(other.jobId, _this.jobId) || other.jobId == _this.jobId)&&(identical(other.workerId, _this.workerId) || other.workerId == _this.workerId)&&(identical(other.message, _this.message) || other.message == _this.message)&&(identical(other.quotedPriceMinor, _this.quotedPriceMinor) || other.quotedPriceMinor == _this.quotedPriceMinor)&&(identical(other.currency, _this.currency) || other.currency == _this.currency)&&(identical(other.status, _this.status) || other.status == _this.status)&&(identical(other.createdAt, _this.createdAt) || other.createdAt == _this.createdAt));
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Specify the persisted JSON key or whether the following member participates in serialization.
@JsonKey(includeFromJson: false, includeToJson: false)
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override
// Explains: Compute a hash consistent with value equality so models work correctly in sets/maps.
int get hashCode {
  // Explains: View this generated mixin as its concrete model before accessing typed fields.
  final _this = this as Application;
  // Explains: Compute a hash consistent with value equality so models work correctly in sets/maps.
  return Object.hash(runtimeType,_this.id,_this.jobId,_this.workerId,_this.message,_this.quotedPriceMinor,_this.currency,_this.status,_this.createdAt);
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override
// Explains: Produce a readable diagnostic model representation for debugging.
String toString() {
  // Explains: View this generated mixin as its concrete model before accessing typed fields.
  final _this = this as Application;
  // Explains: Return the formatted model description including its current field values.
  return 'Application(id: ${_this.id}, jobId: ${_this.jobId}, workerId: ${_this.workerId}, message: ${_this.message}, quotedPriceMinor: ${_this.quotedPriceMinor}, currency: ${_this.currency}, status: ${_this.status}, createdAt: ${_this.createdAt})';
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}


// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

/// @nodoc
// Explains: Define generated immutable-copy support; change the model source rather than this helper.
abstract mixin class $ApplicationCopyWith<$Res>  {
  // Explains: Support immutable copies of this model; unspecified fields retain their current values.
  factory $ApplicationCopyWith(Application value, $Res Function(Application) _then) = _$ApplicationCopyWithImpl;
// Explains: Tell analysis tools that callers should use the returned copied value.
@useResult
// Explains: Declare the generated copyWith call signature and replacement-field arguments.
$Res call({
 // Explains: Declare/configure id: the document identifier, supplied separately from Firestore data; createdAt: the creation time stored in UTC; currency: the currency code, initially LKR; status: the persisted lifecycle state; jobId: the job linking this record to the marketplace lifecycle; workerId: the UID of the worker submitting the quote; message: the text displayed or sent for this item; quotedPriceMinor: the quote in integer currency subunits.
 String id, String jobId, String workerId, String message, int quotedPriceMinor, String currency, ApplicationStatus status,@FirestoreDate() DateTime createdAt
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
});




// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
/// @nodoc
// Explains: Define generated immutable-copy support; change the model source rather than this helper.
class _$ApplicationCopyWithImpl<$Res>
    // Explains: Support immutable copies of this model; unspecified fields retain their current values.
    implements $ApplicationCopyWith<$Res> {
  // Explains: Support immutable copies of this model; unspecified fields retain their current values.
  _$ApplicationCopyWithImpl(this._self, this._then);

  // Explains: Store the immutable model field or generated copy callback used by the methods below.
  final Application _self;
  // Explains: Store the callback that converts a copied model into the requested result type.
  final $Res Function(Application) _then;

/// Create a copy of Application
/// with the given fields replaced by the non-null parameter values.
// Explains: Give the Dart compiler an optimization hint for the following generated helper.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? jobId = null,Object? workerId = null,Object? message = null,Object? quotedPriceMinor = null,Object? currency = null,Object? status = null,Object? createdAt = null,}) {
  // Explains: Pass the newly constructed immutable copy through the generated result callback.
  return _then(Application(
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as String,jobId: null == jobId ? _self.jobId : jobId // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as String,workerId: null == workerId ? _self.workerId : workerId // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as String,message: null == message ? _self.message : message // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as String,quotedPriceMinor: null == quotedPriceMinor ? _self.quotedPriceMinor : quotedPriceMinor // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as int,currency: null == currency ? _self.currency : currency // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as String,status: null == status ? _self.status : status // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as ApplicationStatus,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
// Explains: Cast the copied/deserialized value back to the declared field type after null/default handling.
as DateTime,
  // Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
  ));
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}


/// Adds pattern-matching-related methods to [Application].
// Explains: Group generated callbacks for matching this model variant and choosing a return value.
extension ApplicationPatterns on Application {
/// A variant of `map` that fallback to returning `orElse`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

// Explains: Define generated pattern matching whose result type can be inferred by callers.
@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _Application value)?  $default,{required TResult orElse(),}){
// Explains: Capture the model instance for generated variant dispatch.
final _that = this;
// Explains: Choose the callback matching this generated model variant.
switch (_that) {
// Explains: Handle the matching model variant, or the fallback case when no typed callback applies.
case _Application() when $default != null:
// Explains: Invoke the callback with the matched model or its destructured fields and return its result.
return $default(_that);case _:
  // Explains: Run the caller fallback because the requested model callback does not apply.
  return orElse();

// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
/// A `switch`-like method, using callbacks.
///
/// Callbacks receives the raw object, upcasted.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case final Subclass2 value:
///     return ...;
/// }
/// ```

// Explains: Define generated pattern matching whose result type can be inferred by callers.
@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _Application value)  $default,){
// Explains: Capture the model instance for generated variant dispatch.
final _that = this;
// Explains: Choose the callback matching this generated model variant.
switch (_that) {
// Explains: Handle the matching model variant, or the fallback case when no typed callback applies.
case _Application():
// Explains: Invoke the callback with the matched model or its destructured fields and return its result.
return $default(_that);case _:
  // Explains: Stop this operation with an explicit error because the input or model variant is unsupported.
  throw StateError('Unexpected subclass');

// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
/// A variant of `map` that fallback to returning `null`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return null;
/// }
/// ```

// Explains: Define generated pattern matching whose result type can be inferred by callers.
@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _Application value)?  $default,){
// Explains: Capture the model instance for generated variant dispatch.
final _that = this;
// Explains: Choose the callback matching this generated model variant.
switch (_that) {
// Explains: Handle the matching model variant, or the fallback case when no typed callback applies.
case _Application() when $default != null:
// Explains: Invoke the callback with the matched model or its destructured fields and return its result.
return $default(_that);case _:
  // Explains: Return no result/error; callers interpret null according to this method contract.
  return null;

// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
/// A variant of `when` that fallback to an `orElse` callback.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

// Explains: Define generated pattern matching whose result type can be inferred by callers.
@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id,  String jobId,  String workerId,  String message,  int quotedPriceMinor,  String currency,  ApplicationStatus status, @FirestoreDate()  DateTime createdAt)?  $default,{required TResult orElse(),}) {final _that = this;
// Explains: Choose the callback matching this generated model variant.
switch (_that) {
// Explains: Handle the matching model variant, or the fallback case when no typed callback applies.
case _Application() when $default != null:
// Explains: Invoke the callback with the matched model or its destructured fields and return its result.
return $default(_that.id,_that.jobId,_that.workerId,_that.message,_that.quotedPriceMinor,_that.currency,_that.status,_that.createdAt);case _:
  // Explains: Run the caller fallback because the requested model callback does not apply.
  return orElse();

// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
/// A `switch`-like method, using callbacks.
///
/// As opposed to `map`, this offers destructuring.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case Subclass2(:final field2):
///     return ...;
/// }
/// ```

// Explains: Define generated pattern matching whose result type can be inferred by callers.
@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id,  String jobId,  String workerId,  String message,  int quotedPriceMinor,  String currency,  ApplicationStatus status, @FirestoreDate()  DateTime createdAt)  $default,) {final _that = this;
// Explains: Choose the callback matching this generated model variant.
switch (_that) {
// Explains: Handle the matching model variant, or the fallback case when no typed callback applies.
case _Application():
// Explains: Invoke the callback with the matched model or its destructured fields and return its result.
return $default(_that.id,_that.jobId,_that.workerId,_that.message,_that.quotedPriceMinor,_that.currency,_that.status,_that.createdAt);case _:
  // Explains: Stop this operation with an explicit error because the input or model variant is unsupported.
  throw StateError('Unexpected subclass');

// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
/// A variant of `when` that fallback to returning `null`
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return null;
/// }
/// ```

// Explains: Define generated pattern matching whose result type can be inferred by callers.
@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id,  String jobId,  String workerId,  String message,  int quotedPriceMinor,  String currency,  ApplicationStatus status, @FirestoreDate()  DateTime createdAt)?  $default,) {final _that = this;
// Explains: Choose the callback matching this generated model variant.
switch (_that) {
// Explains: Handle the matching model variant, or the fallback case when no typed callback applies.
case _Application() when $default != null:
// Explains: Invoke the callback with the matched model or its destructured fields and return its result.
return $default(_that.id,_that.jobId,_that.workerId,_that.message,_that.quotedPriceMinor,_that.currency,_that.status,_that.createdAt);case _:
  // Explains: Return no result/error; callers interpret null according to this method contract.
  return null;

// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

/// @nodoc
// Explains: Generate the field-to-JSON and JSON-to-field mapping for this concrete immutable model.
@JsonSerializable()

// Explains: Define the generated implementation/interface for the model; fields originate in models.dart.
class _Application extends Application {
  // Explains: Declare/configure id: the document identifier, supplied separately from Firestore data; createdAt: the creation time stored in UTC; currency: the currency code, initially LKR; status: the persisted lifecycle state; jobId: the job linking this record to the marketplace lifecycle; workerId: the UID of the worker submitting the quote; message: the text displayed or sent for this item; quotedPriceMinor: the quote in integer currency subunits.
  const _Application({required this.id, required this.jobId, required this.workerId, required this.message, required this.quotedPriceMinor, this.currency = 'LKR', this.status = ApplicationStatus.pending, @FirestoreDate() required this.createdAt}): super._();
  // Explains: Delegate field parsing to the generated JSON deserializer for this model.
  factory _Application.fromJson(Map<String, dynamic> json) => _$ApplicationFromJson(json);

// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override final  String id;
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override final  String jobId;
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override final  String workerId;
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override final  String message;
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override final  int quotedPriceMinor;
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override@JsonKey() final  String currency;
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override@JsonKey() final  ApplicationStatus status;
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override@FirestoreDate() final  DateTime createdAt;

/// Create a copy of Application
/// with the given fields replaced by the non-null parameter values.
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override @JsonKey(includeFromJson: false, includeToJson: false)
// Explains: Give the Dart compiler an optimization hint for the following generated helper.
@pragma('vm:prefer-inline')
// Explains: Support immutable copies of this model; unspecified fields retain their current values.
_$ApplicationCopyWith<_Application> get copyWith => __$ApplicationCopyWithImpl<_Application>(this, _$identity);

// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override
// Explains: Expose serialization of this immutable model through its generated field mapper.
Map<String, dynamic> toJson() {
  // Explains: Map between this generated concrete model and its serialized field representation.
  return _$ApplicationToJson(this, );
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override
// Explains: Compare model values instead of requiring both references to be the same object.
bool operator ==(Object other) {
    // Explains: Short-circuit identity matches, then compare the relevant generated model fields for equality.
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _Application&&(identical(other.id, id) || other.id == id)&&(identical(other.jobId, jobId) || other.jobId == jobId)&&(identical(other.workerId, workerId) || other.workerId == workerId)&&(identical(other.message, message) || other.message == message)&&(identical(other.quotedPriceMinor, quotedPriceMinor) || other.quotedPriceMinor == quotedPriceMinor)&&(identical(other.currency, currency) || other.currency == currency)&&(identical(other.status, status) || other.status == status)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt));
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Specify the persisted JSON key or whether the following member participates in serialization.
@JsonKey(includeFromJson: false, includeToJson: false)
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override
// Explains: Compute a hash consistent with value equality so models work correctly in sets/maps.
int get hashCode {
    // Explains: Compute a hash consistent with value equality so models work correctly in sets/maps.
    return Object.hash(runtimeType,id,jobId,workerId,message,quotedPriceMinor,currency,status,createdAt);
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override
// Explains: Produce a readable diagnostic model representation for debugging.
String toString() {
    // Explains: Return the formatted model description including its current field values.
    return 'Application(id: $id, jobId: $jobId, workerId: $workerId, message: $message, quotedPriceMinor: $quotedPriceMinor, currency: $currency, status: $status, createdAt: $createdAt)';
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}


// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

/// @nodoc
// Explains: Define generated immutable-copy support; change the model source rather than this helper.
abstract mixin class _$ApplicationCopyWith<$Res> implements $ApplicationCopyWith<$Res> {
  // Explains: Support immutable copies of this model; unspecified fields retain their current values.
  factory _$ApplicationCopyWith(_Application value, $Res Function(_Application) _then) = __$ApplicationCopyWithImpl;
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override @useResult
// Explains: Declare the generated copyWith call signature and replacement-field arguments.
$Res call({
 // Explains: Declare/configure id: the document identifier, supplied separately from Firestore data; createdAt: the creation time stored in UTC; currency: the currency code, initially LKR; status: the persisted lifecycle state; jobId: the job linking this record to the marketplace lifecycle; workerId: the UID of the worker submitting the quote; message: the text displayed or sent for this item; quotedPriceMinor: the quote in integer currency subunits.
 String id, String jobId, String workerId, String message, int quotedPriceMinor, String currency, ApplicationStatus status,@FirestoreDate() DateTime createdAt
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
});




// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
/// @nodoc
// Explains: Define generated immutable-copy support; change the model source rather than this helper.
class __$ApplicationCopyWithImpl<$Res>
    // Explains: Support immutable copies of this model; unspecified fields retain their current values.
    implements _$ApplicationCopyWith<$Res> {
  // Explains: Support immutable copies of this model; unspecified fields retain their current values.
  __$ApplicationCopyWithImpl(this._self, this._then);

  // Explains: Store the immutable model field or generated copy callback used by the methods below.
  final _Application _self;
  // Explains: Store the callback that converts a copied model into the requested result type.
  final $Res Function(_Application) _then;

/// Create a copy of Application
/// with the given fields replaced by the non-null parameter values.
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? jobId = null,Object? workerId = null,Object? message = null,Object? quotedPriceMinor = null,Object? currency = null,Object? status = null,Object? createdAt = null,}) {
  // Explains: Pass the newly constructed immutable copy through the generated result callback.
  return _then(_Application(
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as String,jobId: null == jobId ? _self.jobId : jobId // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as String,workerId: null == workerId ? _self.workerId : workerId // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as String,message: null == message ? _self.message : message // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as String,quotedPriceMinor: null == quotedPriceMinor ? _self.quotedPriceMinor : quotedPriceMinor // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as int,currency: null == currency ? _self.currency : currency // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as String,status: null == status ? _self.status : status // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as ApplicationStatus,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
// Explains: Cast the copied/deserialized value back to the declared field type after null/default handling.
as DateTime,
  // Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
  ));
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}


// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}


/// @nodoc
// Explains: Define the generated implementation/interface for the model; fields originate in models.dart.
mixin _$Chat {

 // Explains: Declare/configure id: the document identifier, supplied separately from Firestore data; jobId: the job linking this record to the marketplace lifecycle; participants: the two distinct UIDs permitted in this chat; lastMessage: the chat-list message preview; lastAt: the time used to order recent chats; unread: per-participant unread-message counts.
 String get id; String get jobId; List<String> get participants; String get lastMessage;@FirestoreDate() DateTime get lastAt; Map<String, int> get unread;
/// Create a copy of Chat
/// with the given fields replaced by the non-null parameter values.
// Explains: Specify the persisted JSON key or whether the following member participates in serialization.
@JsonKey(includeFromJson: false, includeToJson: false)
// Explains: Give the Dart compiler an optimization hint for the following generated helper.
@pragma('vm:prefer-inline')
// Explains: Support immutable copies of this model; unspecified fields retain their current values.
$ChatCopyWith<Chat> get copyWith => _$ChatCopyWithImpl<Chat>(this as Chat, _$identity);

  /// Serializes this Chat to a JSON map.
  // Explains: Expose serialization of this immutable model through its generated field mapper.
  Map<String, dynamic> toJson();


// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override
// Explains: Compare model values instead of requiring both references to be the same object.
bool operator ==(Object other) {
  // Explains: View this generated mixin as its concrete model before accessing typed fields.
  final _this = this as Chat;
  // Explains: Short-circuit identity matches, then compare the relevant generated model fields for equality.
  return identical(this, other) || (other.runtimeType == runtimeType&&other is Chat&&(identical(other.id, _this.id) || other.id == _this.id)&&(identical(other.jobId, _this.jobId) || other.jobId == _this.jobId)&&const DeepCollectionEquality().equals(other.participants, _this.participants)&&(identical(other.lastMessage, _this.lastMessage) || other.lastMessage == _this.lastMessage)&&(identical(other.lastAt, _this.lastAt) || other.lastAt == _this.lastAt)&&const DeepCollectionEquality().equals(other.unread, _this.unread));
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Specify the persisted JSON key or whether the following member participates in serialization.
@JsonKey(includeFromJson: false, includeToJson: false)
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override
// Explains: Compute a hash consistent with value equality so models work correctly in sets/maps.
int get hashCode {
  // Explains: View this generated mixin as its concrete model before accessing typed fields.
  final _this = this as Chat;
  // Explains: Compute a hash consistent with value equality so models work correctly in sets/maps.
  return Object.hash(runtimeType,_this.id,_this.jobId,const DeepCollectionEquality().hash(_this.participants),_this.lastMessage,_this.lastAt,const DeepCollectionEquality().hash(_this.unread));
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override
// Explains: Produce a readable diagnostic model representation for debugging.
String toString() {
  // Explains: View this generated mixin as its concrete model before accessing typed fields.
  final _this = this as Chat;
  // Explains: Return the formatted model description including its current field values.
  return 'Chat(id: ${_this.id}, jobId: ${_this.jobId}, participants: ${_this.participants}, lastMessage: ${_this.lastMessage}, lastAt: ${_this.lastAt}, unread: ${_this.unread})';
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}


// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

/// @nodoc
// Explains: Define generated immutable-copy support; change the model source rather than this helper.
abstract mixin class $ChatCopyWith<$Res>  {
  // Explains: Support immutable copies of this model; unspecified fields retain their current values.
  factory $ChatCopyWith(Chat value, $Res Function(Chat) _then) = _$ChatCopyWithImpl;
// Explains: Tell analysis tools that callers should use the returned copied value.
@useResult
// Explains: Declare the generated copyWith call signature and replacement-field arguments.
$Res call({
 // Explains: Declare/configure id: the document identifier, supplied separately from Firestore data; jobId: the job linking this record to the marketplace lifecycle; participants: the two distinct UIDs permitted in this chat; lastMessage: the chat-list message preview; lastAt: the time used to order recent chats; unread: per-participant unread-message counts.
 String id, String jobId, List<String> participants, String lastMessage,@FirestoreDate() DateTime lastAt, Map<String, int> unread
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
});




// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
/// @nodoc
// Explains: Define generated immutable-copy support; change the model source rather than this helper.
class _$ChatCopyWithImpl<$Res>
    // Explains: Support immutable copies of this model; unspecified fields retain their current values.
    implements $ChatCopyWith<$Res> {
  // Explains: Support immutable copies of this model; unspecified fields retain their current values.
  _$ChatCopyWithImpl(this._self, this._then);

  // Explains: Store the immutable model field or generated copy callback used by the methods below.
  final Chat _self;
  // Explains: Store the callback that converts a copied model into the requested result type.
  final $Res Function(Chat) _then;

/// Create a copy of Chat
/// with the given fields replaced by the non-null parameter values.
// Explains: Give the Dart compiler an optimization hint for the following generated helper.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? jobId = null,Object? participants = null,Object? lastMessage = null,Object? lastAt = null,Object? unread = null,}) {
  // Explains: Pass the newly constructed immutable copy through the generated result callback.
  return _then(Chat(
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as String,jobId: null == jobId ? _self.jobId : jobId // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as String,participants: null == participants ? _self.participants : participants // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as List<String>,lastMessage: null == lastMessage ? _self.lastMessage : lastMessage // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as String,lastAt: null == lastAt ? _self.lastAt : lastAt // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as DateTime,unread: null == unread ? _self.unread : unread // ignore: cast_nullable_to_non_nullable
// Explains: Cast the copied/deserialized value back to the declared field type after null/default handling.
as Map<String, int>,
  // Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
  ));
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}


/// Adds pattern-matching-related methods to [Chat].
// Explains: Group generated callbacks for matching this model variant and choosing a return value.
extension ChatPatterns on Chat {
/// A variant of `map` that fallback to returning `orElse`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

// Explains: Define generated pattern matching whose result type can be inferred by callers.
@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _Chat value)?  $default,{required TResult orElse(),}){
// Explains: Capture the model instance for generated variant dispatch.
final _that = this;
// Explains: Choose the callback matching this generated model variant.
switch (_that) {
// Explains: Handle the matching model variant, or the fallback case when no typed callback applies.
case _Chat() when $default != null:
// Explains: Invoke the callback with the matched model or its destructured fields and return its result.
return $default(_that);case _:
  // Explains: Run the caller fallback because the requested model callback does not apply.
  return orElse();

// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
/// A `switch`-like method, using callbacks.
///
/// Callbacks receives the raw object, upcasted.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case final Subclass2 value:
///     return ...;
/// }
/// ```

// Explains: Define generated pattern matching whose result type can be inferred by callers.
@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _Chat value)  $default,){
// Explains: Capture the model instance for generated variant dispatch.
final _that = this;
// Explains: Choose the callback matching this generated model variant.
switch (_that) {
// Explains: Handle the matching model variant, or the fallback case when no typed callback applies.
case _Chat():
// Explains: Invoke the callback with the matched model or its destructured fields and return its result.
return $default(_that);case _:
  // Explains: Stop this operation with an explicit error because the input or model variant is unsupported.
  throw StateError('Unexpected subclass');

// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
/// A variant of `map` that fallback to returning `null`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return null;
/// }
/// ```

// Explains: Define generated pattern matching whose result type can be inferred by callers.
@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _Chat value)?  $default,){
// Explains: Capture the model instance for generated variant dispatch.
final _that = this;
// Explains: Choose the callback matching this generated model variant.
switch (_that) {
// Explains: Handle the matching model variant, or the fallback case when no typed callback applies.
case _Chat() when $default != null:
// Explains: Invoke the callback with the matched model or its destructured fields and return its result.
return $default(_that);case _:
  // Explains: Return no result/error; callers interpret null according to this method contract.
  return null;

// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
/// A variant of `when` that fallback to an `orElse` callback.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

// Explains: Define generated pattern matching whose result type can be inferred by callers.
@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id,  String jobId,  List<String> participants,  String lastMessage, @FirestoreDate()  DateTime lastAt,  Map<String, int> unread)?  $default,{required TResult orElse(),}) {final _that = this;
// Explains: Choose the callback matching this generated model variant.
switch (_that) {
// Explains: Handle the matching model variant, or the fallback case when no typed callback applies.
case _Chat() when $default != null:
// Explains: Invoke the callback with the matched model or its destructured fields and return its result.
return $default(_that.id,_that.jobId,_that.participants,_that.lastMessage,_that.lastAt,_that.unread);case _:
  // Explains: Run the caller fallback because the requested model callback does not apply.
  return orElse();

// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
/// A `switch`-like method, using callbacks.
///
/// As opposed to `map`, this offers destructuring.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case Subclass2(:final field2):
///     return ...;
/// }
/// ```

// Explains: Define generated pattern matching whose result type can be inferred by callers.
@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id,  String jobId,  List<String> participants,  String lastMessage, @FirestoreDate()  DateTime lastAt,  Map<String, int> unread)  $default,) {final _that = this;
// Explains: Choose the callback matching this generated model variant.
switch (_that) {
// Explains: Handle the matching model variant, or the fallback case when no typed callback applies.
case _Chat():
// Explains: Invoke the callback with the matched model or its destructured fields and return its result.
return $default(_that.id,_that.jobId,_that.participants,_that.lastMessage,_that.lastAt,_that.unread);case _:
  // Explains: Stop this operation with an explicit error because the input or model variant is unsupported.
  throw StateError('Unexpected subclass');

// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
/// A variant of `when` that fallback to returning `null`
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return null;
/// }
/// ```

// Explains: Define generated pattern matching whose result type can be inferred by callers.
@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id,  String jobId,  List<String> participants,  String lastMessage, @FirestoreDate()  DateTime lastAt,  Map<String, int> unread)?  $default,) {final _that = this;
// Explains: Choose the callback matching this generated model variant.
switch (_that) {
// Explains: Handle the matching model variant, or the fallback case when no typed callback applies.
case _Chat() when $default != null:
// Explains: Invoke the callback with the matched model or its destructured fields and return its result.
return $default(_that.id,_that.jobId,_that.participants,_that.lastMessage,_that.lastAt,_that.unread);case _:
  // Explains: Return no result/error; callers interpret null according to this method contract.
  return null;

// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

/// @nodoc
// Explains: Generate the field-to-JSON and JSON-to-field mapping for this concrete immutable model.
@JsonSerializable()

// Explains: Define the generated implementation/interface for the model; fields originate in models.dart.
class _Chat extends Chat {
  // Explains: Declare/configure id: the document identifier, supplied separately from Firestore data; jobId: the job linking this record to the marketplace lifecycle; participants: the two distinct UIDs permitted in this chat; lastMessage: the chat-list message preview; lastAt: the time used to order recent chats; unread: per-participant unread-message counts.
  const _Chat({required this.id, required this.jobId, required  List<String> participants, this.lastMessage = '', @FirestoreDate() required this.lastAt,  Map<String, int> unread = const {}}): _participants = participants,_unread = unread,super._();
  // Explains: Delegate field parsing to the generated JSON deserializer for this model.
  factory _Chat.fromJson(Map<String, dynamic> json) => _$ChatFromJson(json);

// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override final  String id;
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override final  String jobId;
 // Explains: Store the immutable model field or generated copy callback used by the methods below.
 final  List<String> _participants;
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override List<String> get participants {
  // Explains: Expose collection values through an unmodifiable view to preserve model immutability.
  if (_participants is EqualUnmodifiableListView) return _participants;
  // ignore: implicit_dynamic_type
  // Explains: Expose collection values through an unmodifiable view to preserve model immutability.
  return EqualUnmodifiableListView(_participants);
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override@JsonKey() final  String lastMessage;
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override@FirestoreDate() final  DateTime lastAt;
 // Explains: Store the immutable model field or generated copy callback used by the methods below.
 final  Map<String, int> _unread;
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override@JsonKey() Map<String, int> get unread {
  // Explains: Expose collection values through an unmodifiable view to preserve model immutability.
  if (_unread is EqualUnmodifiableMapView) return _unread;
  // ignore: implicit_dynamic_type
  // Explains: Expose collection values through an unmodifiable view to preserve model immutability.
  return EqualUnmodifiableMapView(_unread);
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}


/// Create a copy of Chat
/// with the given fields replaced by the non-null parameter values.
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override @JsonKey(includeFromJson: false, includeToJson: false)
// Explains: Give the Dart compiler an optimization hint for the following generated helper.
@pragma('vm:prefer-inline')
// Explains: Support immutable copies of this model; unspecified fields retain their current values.
_$ChatCopyWith<_Chat> get copyWith => __$ChatCopyWithImpl<_Chat>(this, _$identity);

// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override
// Explains: Expose serialization of this immutable model through its generated field mapper.
Map<String, dynamic> toJson() {
  // Explains: Map between this generated concrete model and its serialized field representation.
  return _$ChatToJson(this, );
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override
// Explains: Compare model values instead of requiring both references to be the same object.
bool operator ==(Object other) {
    // Explains: Short-circuit identity matches, then compare the relevant generated model fields for equality.
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _Chat&&(identical(other.id, id) || other.id == id)&&(identical(other.jobId, jobId) || other.jobId == jobId)&&const DeepCollectionEquality().equals(other.participants, _participants)&&(identical(other.lastMessage, lastMessage) || other.lastMessage == lastMessage)&&(identical(other.lastAt, lastAt) || other.lastAt == lastAt)&&const DeepCollectionEquality().equals(other.unread, _unread));
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Specify the persisted JSON key or whether the following member participates in serialization.
@JsonKey(includeFromJson: false, includeToJson: false)
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override
// Explains: Compute a hash consistent with value equality so models work correctly in sets/maps.
int get hashCode {
    // Explains: Compute a hash consistent with value equality so models work correctly in sets/maps.
    return Object.hash(runtimeType,id,jobId,const DeepCollectionEquality().hash(_participants),lastMessage,lastAt,const DeepCollectionEquality().hash(_unread));
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override
// Explains: Produce a readable diagnostic model representation for debugging.
String toString() {
    // Explains: Return the formatted model description including its current field values.
    return 'Chat(id: $id, jobId: $jobId, participants: $participants, lastMessage: $lastMessage, lastAt: $lastAt, unread: $unread)';
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}


// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

/// @nodoc
// Explains: Define generated immutable-copy support; change the model source rather than this helper.
abstract mixin class _$ChatCopyWith<$Res> implements $ChatCopyWith<$Res> {
  // Explains: Support immutable copies of this model; unspecified fields retain their current values.
  factory _$ChatCopyWith(_Chat value, $Res Function(_Chat) _then) = __$ChatCopyWithImpl;
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override @useResult
// Explains: Declare the generated copyWith call signature and replacement-field arguments.
$Res call({
 // Explains: Declare/configure id: the document identifier, supplied separately from Firestore data; jobId: the job linking this record to the marketplace lifecycle; participants: the two distinct UIDs permitted in this chat; lastMessage: the chat-list message preview; lastAt: the time used to order recent chats; unread: per-participant unread-message counts.
 String id, String jobId, List<String> participants, String lastMessage,@FirestoreDate() DateTime lastAt, Map<String, int> unread
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
});




// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
/// @nodoc
// Explains: Define generated immutable-copy support; change the model source rather than this helper.
class __$ChatCopyWithImpl<$Res>
    // Explains: Support immutable copies of this model; unspecified fields retain their current values.
    implements _$ChatCopyWith<$Res> {
  // Explains: Support immutable copies of this model; unspecified fields retain their current values.
  __$ChatCopyWithImpl(this._self, this._then);

  // Explains: Store the immutable model field or generated copy callback used by the methods below.
  final _Chat _self;
  // Explains: Store the callback that converts a copied model into the requested result type.
  final $Res Function(_Chat) _then;

/// Create a copy of Chat
/// with the given fields replaced by the non-null parameter values.
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? jobId = null,Object? participants = null,Object? lastMessage = null,Object? lastAt = null,Object? unread = null,}) {
  // Explains: Pass the newly constructed immutable copy through the generated result callback.
  return _then(_Chat(
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as String,jobId: null == jobId ? _self.jobId : jobId // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as String,participants: null == participants ? _self._participants : participants // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as List<String>,lastMessage: null == lastMessage ? _self.lastMessage : lastMessage // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as String,lastAt: null == lastAt ? _self.lastAt : lastAt // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as DateTime,unread: null == unread ? _self._unread : unread // ignore: cast_nullable_to_non_nullable
// Explains: Cast the copied/deserialized value back to the declared field type after null/default handling.
as Map<String, int>,
  // Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
  ));
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}


// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}


/// @nodoc
// Explains: Define the generated implementation/interface for the model; fields originate in models.dart.
mixin _$ChatMessage {

 // Explains: Declare/configure id: the document identifier, supplied separately from Firestore data; senderId: the message author UID; text: the written message or review; imageUrl: the optional attached image URL; sentAt: the message send time; readBy: the UIDs that have read the message.
 String get id; String get senderId; String get text; String? get imageUrl;@FirestoreDate() DateTime get sentAt; List<String> get readBy;
/// Create a copy of ChatMessage
/// with the given fields replaced by the non-null parameter values.
// Explains: Specify the persisted JSON key or whether the following member participates in serialization.
@JsonKey(includeFromJson: false, includeToJson: false)
// Explains: Give the Dart compiler an optimization hint for the following generated helper.
@pragma('vm:prefer-inline')
// Explains: Support immutable copies of this model; unspecified fields retain their current values.
$ChatMessageCopyWith<ChatMessage> get copyWith => _$ChatMessageCopyWithImpl<ChatMessage>(this as ChatMessage, _$identity);

  /// Serializes this ChatMessage to a JSON map.
  // Explains: Expose serialization of this immutable model through its generated field mapper.
  Map<String, dynamic> toJson();


// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override
// Explains: Compare model values instead of requiring both references to be the same object.
bool operator ==(Object other) {
  // Explains: View this generated mixin as its concrete model before accessing typed fields.
  final _this = this as ChatMessage;
  // Explains: Short-circuit identity matches, then compare the relevant generated model fields for equality.
  return identical(this, other) || (other.runtimeType == runtimeType&&other is ChatMessage&&(identical(other.id, _this.id) || other.id == _this.id)&&(identical(other.senderId, _this.senderId) || other.senderId == _this.senderId)&&(identical(other.text, _this.text) || other.text == _this.text)&&(identical(other.imageUrl, _this.imageUrl) || other.imageUrl == _this.imageUrl)&&(identical(other.sentAt, _this.sentAt) || other.sentAt == _this.sentAt)&&const DeepCollectionEquality().equals(other.readBy, _this.readBy));
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Specify the persisted JSON key or whether the following member participates in serialization.
@JsonKey(includeFromJson: false, includeToJson: false)
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override
// Explains: Compute a hash consistent with value equality so models work correctly in sets/maps.
int get hashCode {
  // Explains: View this generated mixin as its concrete model before accessing typed fields.
  final _this = this as ChatMessage;
  // Explains: Compute a hash consistent with value equality so models work correctly in sets/maps.
  return Object.hash(runtimeType,_this.id,_this.senderId,_this.text,_this.imageUrl,_this.sentAt,const DeepCollectionEquality().hash(_this.readBy));
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override
// Explains: Produce a readable diagnostic model representation for debugging.
String toString() {
  // Explains: View this generated mixin as its concrete model before accessing typed fields.
  final _this = this as ChatMessage;
  // Explains: Return the formatted model description including its current field values.
  return 'ChatMessage(id: ${_this.id}, senderId: ${_this.senderId}, text: ${_this.text}, imageUrl: ${_this.imageUrl}, sentAt: ${_this.sentAt}, readBy: ${_this.readBy})';
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}


// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

/// @nodoc
// Explains: Define generated immutable-copy support; change the model source rather than this helper.
abstract mixin class $ChatMessageCopyWith<$Res>  {
  // Explains: Support immutable copies of this model; unspecified fields retain their current values.
  factory $ChatMessageCopyWith(ChatMessage value, $Res Function(ChatMessage) _then) = _$ChatMessageCopyWithImpl;
// Explains: Tell analysis tools that callers should use the returned copied value.
@useResult
// Explains: Declare the generated copyWith call signature and replacement-field arguments.
$Res call({
 // Explains: Declare/configure id: the document identifier, supplied separately from Firestore data; senderId: the message author UID; text: the written message or review; imageUrl: the optional attached image URL; sentAt: the message send time; readBy: the UIDs that have read the message.
 String id, String senderId, String text, String? imageUrl,@FirestoreDate() DateTime sentAt, List<String> readBy
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
});




// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
/// @nodoc
// Explains: Define generated immutable-copy support; change the model source rather than this helper.
class _$ChatMessageCopyWithImpl<$Res>
    // Explains: Support immutable copies of this model; unspecified fields retain their current values.
    implements $ChatMessageCopyWith<$Res> {
  // Explains: Support immutable copies of this model; unspecified fields retain their current values.
  _$ChatMessageCopyWithImpl(this._self, this._then);

  // Explains: Store the immutable model field or generated copy callback used by the methods below.
  final ChatMessage _self;
  // Explains: Store the callback that converts a copied model into the requested result type.
  final $Res Function(ChatMessage) _then;

/// Create a copy of ChatMessage
/// with the given fields replaced by the non-null parameter values.
// Explains: Give the Dart compiler an optimization hint for the following generated helper.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? senderId = null,Object? text = null,Object? imageUrl = freezed,Object? sentAt = null,Object? readBy = null,}) {
  // Explains: Pass the newly constructed immutable copy through the generated result callback.
  return _then(ChatMessage(
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as String,senderId: null == senderId ? _self.senderId : senderId // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as String,text: null == text ? _self.text : text // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as String,imageUrl: freezed == imageUrl ? _self.imageUrl : imageUrl // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as String?,sentAt: null == sentAt ? _self.sentAt : sentAt // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as DateTime,readBy: null == readBy ? _self.readBy : readBy // ignore: cast_nullable_to_non_nullable
// Explains: Cast the copied/deserialized value back to the declared field type after null/default handling.
as List<String>,
  // Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
  ));
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}


/// Adds pattern-matching-related methods to [ChatMessage].
// Explains: Group generated callbacks for matching this model variant and choosing a return value.
extension ChatMessagePatterns on ChatMessage {
/// A variant of `map` that fallback to returning `orElse`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

// Explains: Define generated pattern matching whose result type can be inferred by callers.
@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _ChatMessage value)?  $default,{required TResult orElse(),}){
// Explains: Capture the model instance for generated variant dispatch.
final _that = this;
// Explains: Choose the callback matching this generated model variant.
switch (_that) {
// Explains: Handle the matching model variant, or the fallback case when no typed callback applies.
case _ChatMessage() when $default != null:
// Explains: Invoke the callback with the matched model or its destructured fields and return its result.
return $default(_that);case _:
  // Explains: Run the caller fallback because the requested model callback does not apply.
  return orElse();

// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
/// A `switch`-like method, using callbacks.
///
/// Callbacks receives the raw object, upcasted.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case final Subclass2 value:
///     return ...;
/// }
/// ```

// Explains: Define generated pattern matching whose result type can be inferred by callers.
@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _ChatMessage value)  $default,){
// Explains: Capture the model instance for generated variant dispatch.
final _that = this;
// Explains: Choose the callback matching this generated model variant.
switch (_that) {
// Explains: Handle the matching model variant, or the fallback case when no typed callback applies.
case _ChatMessage():
// Explains: Invoke the callback with the matched model or its destructured fields and return its result.
return $default(_that);case _:
  // Explains: Stop this operation with an explicit error because the input or model variant is unsupported.
  throw StateError('Unexpected subclass');

// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
/// A variant of `map` that fallback to returning `null`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return null;
/// }
/// ```

// Explains: Define generated pattern matching whose result type can be inferred by callers.
@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _ChatMessage value)?  $default,){
// Explains: Capture the model instance for generated variant dispatch.
final _that = this;
// Explains: Choose the callback matching this generated model variant.
switch (_that) {
// Explains: Handle the matching model variant, or the fallback case when no typed callback applies.
case _ChatMessage() when $default != null:
// Explains: Invoke the callback with the matched model or its destructured fields and return its result.
return $default(_that);case _:
  // Explains: Return no result/error; callers interpret null according to this method contract.
  return null;

// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
/// A variant of `when` that fallback to an `orElse` callback.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

// Explains: Define generated pattern matching whose result type can be inferred by callers.
@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id,  String senderId,  String text,  String? imageUrl, @FirestoreDate()  DateTime sentAt,  List<String> readBy)?  $default,{required TResult orElse(),}) {final _that = this;
// Explains: Choose the callback matching this generated model variant.
switch (_that) {
// Explains: Handle the matching model variant, or the fallback case when no typed callback applies.
case _ChatMessage() when $default != null:
// Explains: Invoke the callback with the matched model or its destructured fields and return its result.
return $default(_that.id,_that.senderId,_that.text,_that.imageUrl,_that.sentAt,_that.readBy);case _:
  // Explains: Run the caller fallback because the requested model callback does not apply.
  return orElse();

// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
/// A `switch`-like method, using callbacks.
///
/// As opposed to `map`, this offers destructuring.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case Subclass2(:final field2):
///     return ...;
/// }
/// ```

// Explains: Define generated pattern matching whose result type can be inferred by callers.
@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id,  String senderId,  String text,  String? imageUrl, @FirestoreDate()  DateTime sentAt,  List<String> readBy)  $default,) {final _that = this;
// Explains: Choose the callback matching this generated model variant.
switch (_that) {
// Explains: Handle the matching model variant, or the fallback case when no typed callback applies.
case _ChatMessage():
// Explains: Invoke the callback with the matched model or its destructured fields and return its result.
return $default(_that.id,_that.senderId,_that.text,_that.imageUrl,_that.sentAt,_that.readBy);case _:
  // Explains: Stop this operation with an explicit error because the input or model variant is unsupported.
  throw StateError('Unexpected subclass');

// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
/// A variant of `when` that fallback to returning `null`
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return null;
/// }
/// ```

// Explains: Define generated pattern matching whose result type can be inferred by callers.
@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id,  String senderId,  String text,  String? imageUrl, @FirestoreDate()  DateTime sentAt,  List<String> readBy)?  $default,) {final _that = this;
// Explains: Choose the callback matching this generated model variant.
switch (_that) {
// Explains: Handle the matching model variant, or the fallback case when no typed callback applies.
case _ChatMessage() when $default != null:
// Explains: Invoke the callback with the matched model or its destructured fields and return its result.
return $default(_that.id,_that.senderId,_that.text,_that.imageUrl,_that.sentAt,_that.readBy);case _:
  // Explains: Return no result/error; callers interpret null according to this method contract.
  return null;

// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

/// @nodoc
// Explains: Generate the field-to-JSON and JSON-to-field mapping for this concrete immutable model.
@JsonSerializable()

// Explains: Define the generated implementation/interface for the model; fields originate in models.dart.
class _ChatMessage extends ChatMessage {
  // Explains: Declare/configure id: the document identifier, supplied separately from Firestore data; senderId: the message author UID; text: the written message or review; imageUrl: the optional attached image URL; sentAt: the message send time; readBy: the UIDs that have read the message.
  const _ChatMessage({required this.id, required this.senderId, this.text = '', this.imageUrl, @FirestoreDate() required this.sentAt,  List<String> readBy = const []}): _readBy = readBy,super._();
  // Explains: Delegate field parsing to the generated JSON deserializer for this model.
  factory _ChatMessage.fromJson(Map<String, dynamic> json) => _$ChatMessageFromJson(json);

// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override final  String id;
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override final  String senderId;
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override@JsonKey() final  String text;
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override final  String? imageUrl;
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override@FirestoreDate() final  DateTime sentAt;
 // Explains: Store the immutable model field or generated copy callback used by the methods below.
 final  List<String> _readBy;
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override@JsonKey() List<String> get readBy {
  // Explains: Expose collection values through an unmodifiable view to preserve model immutability.
  if (_readBy is EqualUnmodifiableListView) return _readBy;
  // ignore: implicit_dynamic_type
  // Explains: Expose collection values through an unmodifiable view to preserve model immutability.
  return EqualUnmodifiableListView(_readBy);
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}


/// Create a copy of ChatMessage
/// with the given fields replaced by the non-null parameter values.
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override @JsonKey(includeFromJson: false, includeToJson: false)
// Explains: Give the Dart compiler an optimization hint for the following generated helper.
@pragma('vm:prefer-inline')
// Explains: Support immutable copies of this model; unspecified fields retain their current values.
_$ChatMessageCopyWith<_ChatMessage> get copyWith => __$ChatMessageCopyWithImpl<_ChatMessage>(this, _$identity);

// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override
// Explains: Expose serialization of this immutable model through its generated field mapper.
Map<String, dynamic> toJson() {
  // Explains: Map between this generated concrete model and its serialized field representation.
  return _$ChatMessageToJson(this, );
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override
// Explains: Compare model values instead of requiring both references to be the same object.
bool operator ==(Object other) {
    // Explains: Short-circuit identity matches, then compare the relevant generated model fields for equality.
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _ChatMessage&&(identical(other.id, id) || other.id == id)&&(identical(other.senderId, senderId) || other.senderId == senderId)&&(identical(other.text, text) || other.text == text)&&(identical(other.imageUrl, imageUrl) || other.imageUrl == imageUrl)&&(identical(other.sentAt, sentAt) || other.sentAt == sentAt)&&const DeepCollectionEquality().equals(other.readBy, _readBy));
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Specify the persisted JSON key or whether the following member participates in serialization.
@JsonKey(includeFromJson: false, includeToJson: false)
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override
// Explains: Compute a hash consistent with value equality so models work correctly in sets/maps.
int get hashCode {
    // Explains: Compute a hash consistent with value equality so models work correctly in sets/maps.
    return Object.hash(runtimeType,id,senderId,text,imageUrl,sentAt,const DeepCollectionEquality().hash(_readBy));
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override
// Explains: Produce a readable diagnostic model representation for debugging.
String toString() {
    // Explains: Return the formatted model description including its current field values.
    return 'ChatMessage(id: $id, senderId: $senderId, text: $text, imageUrl: $imageUrl, sentAt: $sentAt, readBy: $readBy)';
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}


// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

/// @nodoc
// Explains: Define generated immutable-copy support; change the model source rather than this helper.
abstract mixin class _$ChatMessageCopyWith<$Res> implements $ChatMessageCopyWith<$Res> {
  // Explains: Support immutable copies of this model; unspecified fields retain their current values.
  factory _$ChatMessageCopyWith(_ChatMessage value, $Res Function(_ChatMessage) _then) = __$ChatMessageCopyWithImpl;
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override @useResult
// Explains: Declare the generated copyWith call signature and replacement-field arguments.
$Res call({
 // Explains: Declare/configure id: the document identifier, supplied separately from Firestore data; senderId: the message author UID; text: the written message or review; imageUrl: the optional attached image URL; sentAt: the message send time; readBy: the UIDs that have read the message.
 String id, String senderId, String text, String? imageUrl,@FirestoreDate() DateTime sentAt, List<String> readBy
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
});




// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
/// @nodoc
// Explains: Define generated immutable-copy support; change the model source rather than this helper.
class __$ChatMessageCopyWithImpl<$Res>
    // Explains: Support immutable copies of this model; unspecified fields retain their current values.
    implements _$ChatMessageCopyWith<$Res> {
  // Explains: Support immutable copies of this model; unspecified fields retain their current values.
  __$ChatMessageCopyWithImpl(this._self, this._then);

  // Explains: Store the immutable model field or generated copy callback used by the methods below.
  final _ChatMessage _self;
  // Explains: Store the callback that converts a copied model into the requested result type.
  final $Res Function(_ChatMessage) _then;

/// Create a copy of ChatMessage
/// with the given fields replaced by the non-null parameter values.
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? senderId = null,Object? text = null,Object? imageUrl = freezed,Object? sentAt = null,Object? readBy = null,}) {
  // Explains: Pass the newly constructed immutable copy through the generated result callback.
  return _then(_ChatMessage(
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as String,senderId: null == senderId ? _self.senderId : senderId // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as String,text: null == text ? _self.text : text // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as String,imageUrl: freezed == imageUrl ? _self.imageUrl : imageUrl // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as String?,sentAt: null == sentAt ? _self.sentAt : sentAt // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as DateTime,readBy: null == readBy ? _self._readBy : readBy // ignore: cast_nullable_to_non_nullable
// Explains: Cast the copied/deserialized value back to the declared field type after null/default handling.
as List<String>,
  // Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
  ));
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}


// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}


/// @nodoc
// Explains: Define the generated implementation/interface for the model; fields originate in models.dart.
mixin _$Review {

 // Explains: Declare/configure id: the document identifier, supplied separately from Firestore data; createdAt: the creation time stored in UTC; jobId: the job linking this record to the marketplace lifecycle; text: the written message or review; raterId: the UID writing the review; rateeId: the UID receiving the review; stars: the numeric star rating.
 String get id; String get jobId; String get raterId; String get rateeId; int get stars; String get text;@FirestoreDate() DateTime get createdAt;
/// Create a copy of Review
/// with the given fields replaced by the non-null parameter values.
// Explains: Specify the persisted JSON key or whether the following member participates in serialization.
@JsonKey(includeFromJson: false, includeToJson: false)
// Explains: Give the Dart compiler an optimization hint for the following generated helper.
@pragma('vm:prefer-inline')
// Explains: Support immutable copies of this model; unspecified fields retain their current values.
$ReviewCopyWith<Review> get copyWith => _$ReviewCopyWithImpl<Review>(this as Review, _$identity);

  /// Serializes this Review to a JSON map.
  // Explains: Expose serialization of this immutable model through its generated field mapper.
  Map<String, dynamic> toJson();


// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override
// Explains: Compare model values instead of requiring both references to be the same object.
bool operator ==(Object other) {
  // Explains: View this generated mixin as its concrete model before accessing typed fields.
  final _this = this as Review;
  // Explains: Short-circuit identity matches, then compare the relevant generated model fields for equality.
  return identical(this, other) || (other.runtimeType == runtimeType&&other is Review&&(identical(other.id, _this.id) || other.id == _this.id)&&(identical(other.jobId, _this.jobId) || other.jobId == _this.jobId)&&(identical(other.raterId, _this.raterId) || other.raterId == _this.raterId)&&(identical(other.rateeId, _this.rateeId) || other.rateeId == _this.rateeId)&&(identical(other.stars, _this.stars) || other.stars == _this.stars)&&(identical(other.text, _this.text) || other.text == _this.text)&&(identical(other.createdAt, _this.createdAt) || other.createdAt == _this.createdAt));
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Specify the persisted JSON key or whether the following member participates in serialization.
@JsonKey(includeFromJson: false, includeToJson: false)
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override
// Explains: Compute a hash consistent with value equality so models work correctly in sets/maps.
int get hashCode {
  // Explains: View this generated mixin as its concrete model before accessing typed fields.
  final _this = this as Review;
  // Explains: Compute a hash consistent with value equality so models work correctly in sets/maps.
  return Object.hash(runtimeType,_this.id,_this.jobId,_this.raterId,_this.rateeId,_this.stars,_this.text,_this.createdAt);
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override
// Explains: Produce a readable diagnostic model representation for debugging.
String toString() {
  // Explains: View this generated mixin as its concrete model before accessing typed fields.
  final _this = this as Review;
  // Explains: Return the formatted model description including its current field values.
  return 'Review(id: ${_this.id}, jobId: ${_this.jobId}, raterId: ${_this.raterId}, rateeId: ${_this.rateeId}, stars: ${_this.stars}, text: ${_this.text}, createdAt: ${_this.createdAt})';
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}


// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

/// @nodoc
// Explains: Define generated immutable-copy support; change the model source rather than this helper.
abstract mixin class $ReviewCopyWith<$Res>  {
  // Explains: Support immutable copies of this model; unspecified fields retain their current values.
  factory $ReviewCopyWith(Review value, $Res Function(Review) _then) = _$ReviewCopyWithImpl;
// Explains: Tell analysis tools that callers should use the returned copied value.
@useResult
// Explains: Declare the generated copyWith call signature and replacement-field arguments.
$Res call({
 // Explains: Declare/configure id: the document identifier, supplied separately from Firestore data; createdAt: the creation time stored in UTC; jobId: the job linking this record to the marketplace lifecycle; text: the written message or review; raterId: the UID writing the review; rateeId: the UID receiving the review; stars: the numeric star rating.
 String id, String jobId, String raterId, String rateeId, int stars, String text,@FirestoreDate() DateTime createdAt
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
});




// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
/// @nodoc
// Explains: Define generated immutable-copy support; change the model source rather than this helper.
class _$ReviewCopyWithImpl<$Res>
    // Explains: Support immutable copies of this model; unspecified fields retain their current values.
    implements $ReviewCopyWith<$Res> {
  // Explains: Support immutable copies of this model; unspecified fields retain their current values.
  _$ReviewCopyWithImpl(this._self, this._then);

  // Explains: Store the immutable model field or generated copy callback used by the methods below.
  final Review _self;
  // Explains: Store the callback that converts a copied model into the requested result type.
  final $Res Function(Review) _then;

/// Create a copy of Review
/// with the given fields replaced by the non-null parameter values.
// Explains: Give the Dart compiler an optimization hint for the following generated helper.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? jobId = null,Object? raterId = null,Object? rateeId = null,Object? stars = null,Object? text = null,Object? createdAt = null,}) {
  // Explains: Pass the newly constructed immutable copy through the generated result callback.
  return _then(Review(
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as String,jobId: null == jobId ? _self.jobId : jobId // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as String,raterId: null == raterId ? _self.raterId : raterId // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as String,rateeId: null == rateeId ? _self.rateeId : rateeId // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as String,stars: null == stars ? _self.stars : stars // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as int,text: null == text ? _self.text : text // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as String,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
// Explains: Cast the copied/deserialized value back to the declared field type after null/default handling.
as DateTime,
  // Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
  ));
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}


/// Adds pattern-matching-related methods to [Review].
// Explains: Group generated callbacks for matching this model variant and choosing a return value.
extension ReviewPatterns on Review {
/// A variant of `map` that fallback to returning `orElse`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

// Explains: Define generated pattern matching whose result type can be inferred by callers.
@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _Review value)?  $default,{required TResult orElse(),}){
// Explains: Capture the model instance for generated variant dispatch.
final _that = this;
// Explains: Choose the callback matching this generated model variant.
switch (_that) {
// Explains: Handle the matching model variant, or the fallback case when no typed callback applies.
case _Review() when $default != null:
// Explains: Invoke the callback with the matched model or its destructured fields and return its result.
return $default(_that);case _:
  // Explains: Run the caller fallback because the requested model callback does not apply.
  return orElse();

// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
/// A `switch`-like method, using callbacks.
///
/// Callbacks receives the raw object, upcasted.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case final Subclass2 value:
///     return ...;
/// }
/// ```

// Explains: Define generated pattern matching whose result type can be inferred by callers.
@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _Review value)  $default,){
// Explains: Capture the model instance for generated variant dispatch.
final _that = this;
// Explains: Choose the callback matching this generated model variant.
switch (_that) {
// Explains: Handle the matching model variant, or the fallback case when no typed callback applies.
case _Review():
// Explains: Invoke the callback with the matched model or its destructured fields and return its result.
return $default(_that);case _:
  // Explains: Stop this operation with an explicit error because the input or model variant is unsupported.
  throw StateError('Unexpected subclass');

// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
/// A variant of `map` that fallback to returning `null`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return null;
/// }
/// ```

// Explains: Define generated pattern matching whose result type can be inferred by callers.
@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _Review value)?  $default,){
// Explains: Capture the model instance for generated variant dispatch.
final _that = this;
// Explains: Choose the callback matching this generated model variant.
switch (_that) {
// Explains: Handle the matching model variant, or the fallback case when no typed callback applies.
case _Review() when $default != null:
// Explains: Invoke the callback with the matched model or its destructured fields and return its result.
return $default(_that);case _:
  // Explains: Return no result/error; callers interpret null according to this method contract.
  return null;

// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
/// A variant of `when` that fallback to an `orElse` callback.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

// Explains: Define generated pattern matching whose result type can be inferred by callers.
@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id,  String jobId,  String raterId,  String rateeId,  int stars,  String text, @FirestoreDate()  DateTime createdAt)?  $default,{required TResult orElse(),}) {final _that = this;
// Explains: Choose the callback matching this generated model variant.
switch (_that) {
// Explains: Handle the matching model variant, or the fallback case when no typed callback applies.
case _Review() when $default != null:
// Explains: Invoke the callback with the matched model or its destructured fields and return its result.
return $default(_that.id,_that.jobId,_that.raterId,_that.rateeId,_that.stars,_that.text,_that.createdAt);case _:
  // Explains: Run the caller fallback because the requested model callback does not apply.
  return orElse();

// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
/// A `switch`-like method, using callbacks.
///
/// As opposed to `map`, this offers destructuring.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case Subclass2(:final field2):
///     return ...;
/// }
/// ```

// Explains: Define generated pattern matching whose result type can be inferred by callers.
@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id,  String jobId,  String raterId,  String rateeId,  int stars,  String text, @FirestoreDate()  DateTime createdAt)  $default,) {final _that = this;
// Explains: Choose the callback matching this generated model variant.
switch (_that) {
// Explains: Handle the matching model variant, or the fallback case when no typed callback applies.
case _Review():
// Explains: Invoke the callback with the matched model or its destructured fields and return its result.
return $default(_that.id,_that.jobId,_that.raterId,_that.rateeId,_that.stars,_that.text,_that.createdAt);case _:
  // Explains: Stop this operation with an explicit error because the input or model variant is unsupported.
  throw StateError('Unexpected subclass');

// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
/// A variant of `when` that fallback to returning `null`
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return null;
/// }
/// ```

// Explains: Define generated pattern matching whose result type can be inferred by callers.
@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id,  String jobId,  String raterId,  String rateeId,  int stars,  String text, @FirestoreDate()  DateTime createdAt)?  $default,) {final _that = this;
// Explains: Choose the callback matching this generated model variant.
switch (_that) {
// Explains: Handle the matching model variant, or the fallback case when no typed callback applies.
case _Review() when $default != null:
// Explains: Invoke the callback with the matched model or its destructured fields and return its result.
return $default(_that.id,_that.jobId,_that.raterId,_that.rateeId,_that.stars,_that.text,_that.createdAt);case _:
  // Explains: Return no result/error; callers interpret null according to this method contract.
  return null;

// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

/// @nodoc
// Explains: Generate the field-to-JSON and JSON-to-field mapping for this concrete immutable model.
@JsonSerializable()

// Explains: Define the generated implementation/interface for the model; fields originate in models.dart.
class _Review extends Review {
  // Explains: Declare/configure id: the document identifier, supplied separately from Firestore data; createdAt: the creation time stored in UTC; jobId: the job linking this record to the marketplace lifecycle; text: the written message or review; raterId: the UID writing the review; rateeId: the UID receiving the review; stars: the numeric star rating.
  const _Review({required this.id, required this.jobId, required this.raterId, required this.rateeId, required this.stars, this.text = '', @FirestoreDate() required this.createdAt}): super._();
  // Explains: Delegate field parsing to the generated JSON deserializer for this model.
  factory _Review.fromJson(Map<String, dynamic> json) => _$ReviewFromJson(json);

// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override final  String id;
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override final  String jobId;
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override final  String raterId;
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override final  String rateeId;
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override final  int stars;
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override@JsonKey() final  String text;
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override@FirestoreDate() final  DateTime createdAt;

/// Create a copy of Review
/// with the given fields replaced by the non-null parameter values.
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override @JsonKey(includeFromJson: false, includeToJson: false)
// Explains: Give the Dart compiler an optimization hint for the following generated helper.
@pragma('vm:prefer-inline')
// Explains: Support immutable copies of this model; unspecified fields retain their current values.
_$ReviewCopyWith<_Review> get copyWith => __$ReviewCopyWithImpl<_Review>(this, _$identity);

// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override
// Explains: Expose serialization of this immutable model through its generated field mapper.
Map<String, dynamic> toJson() {
  // Explains: Map between this generated concrete model and its serialized field representation.
  return _$ReviewToJson(this, );
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override
// Explains: Compare model values instead of requiring both references to be the same object.
bool operator ==(Object other) {
    // Explains: Short-circuit identity matches, then compare the relevant generated model fields for equality.
    return identical(this, other) || (other.runtimeType == runtimeType&&other is _Review&&(identical(other.id, id) || other.id == id)&&(identical(other.jobId, jobId) || other.jobId == jobId)&&(identical(other.raterId, raterId) || other.raterId == raterId)&&(identical(other.rateeId, rateeId) || other.rateeId == rateeId)&&(identical(other.stars, stars) || other.stars == stars)&&(identical(other.text, text) || other.text == text)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt));
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Specify the persisted JSON key or whether the following member participates in serialization.
@JsonKey(includeFromJson: false, includeToJson: false)
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override
// Explains: Compute a hash consistent with value equality so models work correctly in sets/maps.
int get hashCode {
    // Explains: Compute a hash consistent with value equality so models work correctly in sets/maps.
    return Object.hash(runtimeType,id,jobId,raterId,rateeId,stars,text,createdAt);
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override
// Explains: Produce a readable diagnostic model representation for debugging.
String toString() {
    // Explains: Return the formatted model description including its current field values.
    return 'Review(id: $id, jobId: $jobId, raterId: $raterId, rateeId: $rateeId, stars: $stars, text: $text, createdAt: $createdAt)';
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}


// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

/// @nodoc
// Explains: Define generated immutable-copy support; change the model source rather than this helper.
abstract mixin class _$ReviewCopyWith<$Res> implements $ReviewCopyWith<$Res> {
  // Explains: Support immutable copies of this model; unspecified fields retain their current values.
  factory _$ReviewCopyWith(_Review value, $Res Function(_Review) _then) = __$ReviewCopyWithImpl;
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override @useResult
// Explains: Declare the generated copyWith call signature and replacement-field arguments.
$Res call({
 // Explains: Declare/configure id: the document identifier, supplied separately from Firestore data; createdAt: the creation time stored in UTC; jobId: the job linking this record to the marketplace lifecycle; text: the written message or review; raterId: the UID writing the review; rateeId: the UID receiving the review; stars: the numeric star rating.
 String id, String jobId, String raterId, String rateeId, int stars, String text,@FirestoreDate() DateTime createdAt
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
});




// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
/// @nodoc
// Explains: Define generated immutable-copy support; change the model source rather than this helper.
class __$ReviewCopyWithImpl<$Res>
    // Explains: Support immutable copies of this model; unspecified fields retain their current values.
    implements _$ReviewCopyWith<$Res> {
  // Explains: Support immutable copies of this model; unspecified fields retain their current values.
  __$ReviewCopyWithImpl(this._self, this._then);

  // Explains: Store the immutable model field or generated copy callback used by the methods below.
  final _Review _self;
  // Explains: Store the callback that converts a copied model into the requested result type.
  final $Res Function(_Review) _then;

/// Create a copy of Review
/// with the given fields replaced by the non-null parameter values.
// Explains: Implement an inherited interface method or property instead of defining an unrelated API.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? jobId = null,Object? raterId = null,Object? rateeId = null,Object? stars = null,Object? text = null,Object? createdAt = null,}) {
  // Explains: Pass the newly constructed immutable copy through the generated result callback.
  return _then(_Review(
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as String,jobId: null == jobId ? _self.jobId : jobId // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as String,raterId: null == raterId ? _self.raterId : raterId // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as String,rateeId: null == rateeId ? _self.rateeId : rateeId // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as String,stars: null == stars ? _self.stars : stars // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as int,text: null == text ? _self.text : text // ignore: cast_nullable_to_non_nullable
// Explains: Keep the original field when no replacement is supplied; otherwise use the requested copied value.
as String,createdAt: null == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
// Explains: Cast the copied/deserialized value back to the declared field type after null/default handling.
as DateTime,
  // Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
  ));
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}


// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// dart format on
