// GENERATED FILE: change common/lib/src/models/models.dart instead.
// Regenerate from common/ using dart run build_runner build. Manual changes here are overwritten.

// GENERATED CODE - DO NOT MODIFY BY HAND

// Explains: Attach generated declarations to models.dart so they share its imports and private types.
part of 'models.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

// Explains: Map between this generated concrete model and its serialized field representation.
_GeoLocation _$GeoLocationFromJson(Map<String, dynamic> json) => _GeoLocation(
  // Explains: Map lat (latitude in decimal degrees) between the serialized record and typed model, preserving declared defaults.
  lat: (json['lat'] as num).toDouble(),
  // Explains: Map lng (longitude in decimal degrees) between the serialized record and typed model, preserving declared defaults.
  lng: (json['lng'] as num).toDouble(),
  // Explains: Map geohash (the spatial prefix used to narrow location searches) between the serialized record and typed model, preserving declared defaults.
  geohash: json['geohash'] as String,
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
);

// Explains: Map between this generated concrete model and its serialized field representation.
Map<String, dynamic> _$GeoLocationToJson(_GeoLocation instance) =>
    // Explains: Begin the serialized field map consumed by Firestore/model conversion.
    <String, dynamic>{
      // Explains: Map lat (latitude in decimal degrees) between the serialized record and typed model, preserving declared defaults.
      'lat': instance.lat,
      // Explains: Map lng (longitude in decimal degrees) between the serialized record and typed model, preserving declared defaults.
      'lng': instance.lng,
      // Explains: Map geohash (the spatial prefix used to narrow location searches) between the serialized record and typed model, preserving declared defaults.
      'geohash': instance.geohash,
    // Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
    };

// Explains: Map between this generated concrete model and its serialized field representation.
_UserModel _$UserModelFromJson(Map<String, dynamic> json) => _UserModel(
  // Explains: Map id (the document identifier, supplied separately from Firestore data) between the serialized record and typed model, preserving declared defaults.
  id: json['id'] as String,
  // Explains: Map name (the display name shown to other users) between the serialized record and typed model, preserving declared defaults.
  name: json['name'] as String,
  // Explains: Map isClient (whether the account has the client role) between the serialized record and typed model, preserving declared defaults.
  isClient: json['isClient'] as bool? ?? false,
  // Explains: Map isWorker (whether the account has the worker role) between the serialized record and typed model, preserving declared defaults.
  isWorker: json['isWorker'] as bool? ?? false,
  // Explains: Map onboardingComplete (whether required profile setup is finished) between the serialized record and typed model, preserving declared defaults.
  onboardingComplete: json['onboardingComplete'] as bool? ?? false,
  // Explains: Map photoUrl (the optional profile-photo URL) between the serialized record and typed model, preserving declared defaults.
  photoUrl: json['photoUrl'] as String?,
  // Explains: Map city (the selected city) between the serialized record and typed model, preserving declared defaults.
  city: json['city'] as String?,
  // Explains: Map geo (the location used for nearby matching) between the serialized record and typed model, preserving declared defaults.
  geo: json['geo'] == null
      // Explains: Select this value/widget when the condition on the preceding line is true.
      ? null
      // Explains: Select this alternative value/widget when the preceding condition is false.
      : GeoLocation.fromJson(json['geo'] as Map<String, dynamic>),
  // Explains: Convert the stored timestamp through the shared UTC date converter.
  createdAt: const FirestoreDate().fromJson(json['createdAt'] as Object),
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
);

// Explains: Map between this generated concrete model and its serialized field representation.
Map<String, dynamic> _$UserModelToJson(_UserModel instance) =>
    // Explains: Begin the serialized field map consumed by Firestore/model conversion.
    <String, dynamic>{
      // Explains: Map id (the document identifier, supplied separately from Firestore data) between the serialized record and typed model, preserving declared defaults.
      'id': instance.id,
      // Explains: Map name (the display name shown to other users) between the serialized record and typed model, preserving declared defaults.
      'name': instance.name,
      // Explains: Map isClient (whether the account has the client role) between the serialized record and typed model, preserving declared defaults.
      'isClient': instance.isClient,
      // Explains: Map isWorker (whether the account has the worker role) between the serialized record and typed model, preserving declared defaults.
      'isWorker': instance.isWorker,
      // Explains: Map onboardingComplete (whether required profile setup is finished) between the serialized record and typed model, preserving declared defaults.
      'onboardingComplete': instance.onboardingComplete,
      // Explains: Map photoUrl (the optional profile-photo URL) between the serialized record and typed model, preserving declared defaults.
      'photoUrl': instance.photoUrl,
      // Explains: Map city (the selected city) between the serialized record and typed model, preserving declared defaults.
      'city': instance.city,
      // Explains: Map geo (the location used for nearby matching) between the serialized record and typed model, preserving declared defaults.
      'geo': instance.geo?.toJson(),
      // Explains: Serialize the date as a Firestore Timestamp rather than locale-dependent text.
      'createdAt': const FirestoreDate().toJson(instance.createdAt),
    // Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
    };

// Explains: Map between this generated concrete model and its serialized field representation.
_WorkerProfile _$WorkerProfileFromJson(
  // Explains: Accept the source field map to deserialize into a typed model.
  Map<String, dynamic> json,
// Explains: Construct the concrete worker profile from the converted JSON fields that follow.
) => _WorkerProfile(
  // Explains: Map id (the document identifier, supplied separately from Firestore data) between the serialized record and typed model, preserving declared defaults.
  id: json['id'] as String,
  // Explains: Map skills (category IDs describing the worker skills) between the serialized record and typed model, preserving declared defaults.
  skills:
      // Explains: Convert the stored collection to its declared element types and apply the following fallback if absent.
      (json['skills'] as List<dynamic>?)?.map((e) => e as String).toList() ??
      // Explains: Use an empty immutable collection when the serialized field is missing.
      const [],
  // Explains: Map bio (the worker introduction) between the serialized record and typed model, preserving declared defaults.
  bio: json['bio'] as String? ?? '',
  // Explains: Map experienceYears (years of relevant experience) between the serialized record and typed model, preserving declared defaults.
  experienceYears: (json['experienceYears'] as num?)?.toInt() ?? 0,
  // Explains: Map dayRateMinor (the daily rate in integer currency subunits) between the serialized record and typed model, preserving declared defaults.
  dayRateMinor: (json['dayRateMinor'] as num).toInt(),
  // Explains: Map currency (the currency code, initially LKR) between the serialized record and typed model, preserving declared defaults.
  currency: json['currency'] as String? ?? 'LKR',
  // Explains: Map base (the worker base location) between the serialized record and typed model, preserving declared defaults.
  base: GeoLocation.fromJson(json['base'] as Map<String, dynamic>),
  // Explains: Map serviceRadiusKm (the maximum travel radius in kilometres) between the serialized record and typed model, preserving declared defaults.
  serviceRadiusKm: (json['serviceRadiusKm'] as num).toDouble(),
  // Explains: Map portfolio (the worker portfolio image URLs) between the serialized record and typed model, preserving declared defaults.
  portfolio:
      // Explains: Convert the stored collection to its declared element types and apply the following fallback if absent.
      (json['portfolio'] as List<dynamic>?)?.map((e) => e as String).toList() ??
      // Explains: Use an empty immutable collection when the serialized field is missing.
      const [],
  // Explains: Map ratingAvg (the server-maintained average rating) between the serialized record and typed model, preserving declared defaults.
  ratingAvg: (json['ratingAvg'] as num?)?.toDouble() ?? 0,
  // Explains: Map ratingCount (the server-maintained number of ratings) between the serialized record and typed model, preserving declared defaults.
  ratingCount: (json['ratingCount'] as num?)?.toInt() ?? 0,
  // Explains: Map jobsCompleted (the server-maintained completed-job count) between the serialized record and typed model, preserving declared defaults.
  jobsCompleted: (json['jobsCompleted'] as num?)?.toInt() ?? 0,
  // Explains: Map isAvailable (whether the worker is currently available) between the serialized record and typed model, preserving declared defaults.
  isAvailable: json['isAvailable'] as bool? ?? false,
  // Explains: Map isVerified (the server-controlled verification flag) between the serialized record and typed model, preserving declared defaults.
  isVerified: json['isVerified'] as bool? ?? false,
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
);

// Explains: Map between this generated concrete model and its serialized field representation.
Map<String, dynamic> _$WorkerProfileToJson(_WorkerProfile instance) =>
    // Explains: Begin the serialized field map consumed by Firestore/model conversion.
    <String, dynamic>{
      // Explains: Map id (the document identifier, supplied separately from Firestore data) between the serialized record and typed model, preserving declared defaults.
      'id': instance.id,
      // Explains: Map skills (category IDs describing the worker skills) between the serialized record and typed model, preserving declared defaults.
      'skills': instance.skills,
      // Explains: Map bio (the worker introduction) between the serialized record and typed model, preserving declared defaults.
      'bio': instance.bio,
      // Explains: Map experienceYears (years of relevant experience) between the serialized record and typed model, preserving declared defaults.
      'experienceYears': instance.experienceYears,
      // Explains: Map dayRateMinor (the daily rate in integer currency subunits) between the serialized record and typed model, preserving declared defaults.
      'dayRateMinor': instance.dayRateMinor,
      // Explains: Map currency (the currency code, initially LKR) between the serialized record and typed model, preserving declared defaults.
      'currency': instance.currency,
      // Explains: Map base (the worker base location) between the serialized record and typed model, preserving declared defaults.
      'base': instance.base.toJson(),
      // Explains: Map serviceRadiusKm (the maximum travel radius in kilometres) between the serialized record and typed model, preserving declared defaults.
      'serviceRadiusKm': instance.serviceRadiusKm,
      // Explains: Map portfolio (the worker portfolio image URLs) between the serialized record and typed model, preserving declared defaults.
      'portfolio': instance.portfolio,
      // Explains: Map ratingAvg (the server-maintained average rating) between the serialized record and typed model, preserving declared defaults.
      'ratingAvg': instance.ratingAvg,
      // Explains: Map ratingCount (the server-maintained number of ratings) between the serialized record and typed model, preserving declared defaults.
      'ratingCount': instance.ratingCount,
      // Explains: Map jobsCompleted (the server-maintained completed-job count) between the serialized record and typed model, preserving declared defaults.
      'jobsCompleted': instance.jobsCompleted,
      // Explains: Map isAvailable (whether the worker is currently available) between the serialized record and typed model, preserving declared defaults.
      'isAvailable': instance.isAvailable,
      // Explains: Map isVerified (the server-controlled verification flag) between the serialized record and typed model, preserving declared defaults.
      'isVerified': instance.isVerified,
    // Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
    };

// Explains: Map between this generated concrete model and its serialized field representation.
_Category _$CategoryFromJson(Map<String, dynamic> json) => _Category(
  // Explains: Map id (the document identifier, supplied separately from Firestore data) between the serialized record and typed model, preserving declared defaults.
  id: json['id'] as String,
  // Explains: Map nameEn (the English category label) between the serialized record and typed model, preserving declared defaults.
  nameEn: json['name_en'] as String,
  // Explains: Map nameSi (the Sinhala category label) between the serialized record and typed model, preserving declared defaults.
  nameSi: json['name_si'] as String? ?? '',
  // Explains: Map nameTa (the Tamil category label) between the serialized record and typed model, preserving declared defaults.
  nameTa: json['name_ta'] as String? ?? '',
  // Explains: Map icon (the icon used to represent this item) between the serialized record and typed model, preserving declared defaults.
  icon: json['icon'] as String,
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
);

// Explains: Map between this generated concrete model and its serialized field representation.
Map<String, dynamic> _$CategoryToJson(_Category instance) => <String, dynamic>{
  // Explains: Map id (the document identifier, supplied separately from Firestore data) between the serialized record and typed model, preserving declared defaults.
  'id': instance.id,
  // Explains: Write the English category label under the agreed Firestore key name_en.
  'name_en': instance.nameEn,
  // Explains: Write the Sinhala category label under the agreed Firestore key name_si.
  'name_si': instance.nameSi,
  // Explains: Write the Tamil category label under the agreed Firestore key name_ta.
  'name_ta': instance.nameTa,
  // Explains: Map icon (the icon used to represent this item) between the serialized record and typed model, preserving declared defaults.
  'icon': instance.icon,
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
};

// Explains: Map between this generated concrete model and its serialized field representation.
_Job _$JobFromJson(Map<String, dynamic> json) => _Job(
  // Explains: Map id (the document identifier, supplied separately from Firestore data) between the serialized record and typed model, preserving declared defaults.
  id: json['id'] as String,
  // Explains: Map clientId (the UID of the client who owns the job) between the serialized record and typed model, preserving declared defaults.
  clientId: json['clientId'] as String,
  // Explains: Map title (the visible title) between the serialized record and typed model, preserving declared defaults.
  title: json['title'] as String,
  // Explains: Map description (the description of the requested work) between the serialized record and typed model, preserving declared defaults.
  description: json['description'] as String,
  // Explains: Map categoryId (the category used for skill matching) between the serialized record and typed model, preserving declared defaults.
  categoryId: json['categoryId'] as String,
  // Explains: Map photos (the job photo URLs) between the serialized record and typed model, preserving declared defaults.
  photos:
      // Explains: Convert the stored collection to its declared element types and apply the following fallback if absent.
      (json['photos'] as List<dynamic>?)?.map((e) => e as String).toList() ??
      // Explains: Use an empty immutable collection when the serialized field is missing.
      const [],
  // Explains: Map budgetMinMinor (the lower budget in integer currency subunits) between the serialized record and typed model, preserving declared defaults.
  budgetMinMinor: (json['budgetMinMinor'] as num).toInt(),
  // Explains: Map budgetMaxMinor (the upper budget in integer currency subunits) between the serialized record and typed model, preserving declared defaults.
  budgetMaxMinor: (json['budgetMaxMinor'] as num).toInt(),
  // Explains: Map currency (the currency code, initially LKR) between the serialized record and typed model, preserving declared defaults.
  currency: json['currency'] as String? ?? 'LKR',
  // Explains: Map geo (the location used for nearby matching) between the serialized record and typed model, preserving declared defaults.
  geo: GeoLocation.fromJson(json['geo'] as Map<String, dynamic>),
  // Explains: Map addressText (the human-readable work address) between the serialized record and typed model, preserving declared defaults.
  addressText: json['addressText'] as String,
  // Explains: Convert the stored timestamp through the shared UTC date converter.
  preferredDate: const FirestoreDate().fromJson(
    // Explains: Read this stored field and convert it to the declared model type/default.
    json['preferredDate'] as Object,
  // Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
  ),
  // Explains: Map status (the persisted lifecycle state) between the serialized record and typed model, preserving declared defaults.
  status:
      // Explains: Resolve a stored state string to its enum value, using the declared fallback when nullable.
      $enumDecodeNullable(_$JobStatusEnumMap, json['status']) ??
      // Explains: Associate this enum value with its database string; renaming requires coordinated data migration.
      JobStatus.draft,
  // Explains: Map assignedWorkerId (the selected worker UID, absent before assignment) between the serialized record and typed model, preserving declared defaults.
  assignedWorkerId: json['assignedWorkerId'] as String?,
  // Explains: Map applicationCount (the server-maintained quote count) between the serialized record and typed model, preserving declared defaults.
  applicationCount: (json['applicationCount'] as num?)?.toInt() ?? 0,
  // Explains: Map completionRequested (whether the worker has requested client confirmation) between the serialized record and typed model, preserving declared defaults.
  completionRequested: json['completionRequested'] as bool? ?? false,
  // Explains: Convert the stored timestamp through the shared UTC date converter.
  createdAt: const FirestoreDate().fromJson(json['createdAt'] as Object),
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
);

// Explains: Map between this generated concrete model and its serialized field representation.
Map<String, dynamic> _$JobToJson(_Job instance) => <String, dynamic>{
  // Explains: Map id (the document identifier, supplied separately from Firestore data) between the serialized record and typed model, preserving declared defaults.
  'id': instance.id,
  // Explains: Map clientId (the UID of the client who owns the job) between the serialized record and typed model, preserving declared defaults.
  'clientId': instance.clientId,
  // Explains: Map title (the visible title) between the serialized record and typed model, preserving declared defaults.
  'title': instance.title,
  // Explains: Map description (the description of the requested work) between the serialized record and typed model, preserving declared defaults.
  'description': instance.description,
  // Explains: Map categoryId (the category used for skill matching) between the serialized record and typed model, preserving declared defaults.
  'categoryId': instance.categoryId,
  // Explains: Map photos (the job photo URLs) between the serialized record and typed model, preserving declared defaults.
  'photos': instance.photos,
  // Explains: Map budgetMinMinor (the lower budget in integer currency subunits) between the serialized record and typed model, preserving declared defaults.
  'budgetMinMinor': instance.budgetMinMinor,
  // Explains: Map budgetMaxMinor (the upper budget in integer currency subunits) between the serialized record and typed model, preserving declared defaults.
  'budgetMaxMinor': instance.budgetMaxMinor,
  // Explains: Map currency (the currency code, initially LKR) between the serialized record and typed model, preserving declared defaults.
  'currency': instance.currency,
  // Explains: Map geo (the location used for nearby matching) between the serialized record and typed model, preserving declared defaults.
  'geo': instance.geo.toJson(),
  // Explains: Map addressText (the human-readable work address) between the serialized record and typed model, preserving declared defaults.
  'addressText': instance.addressText,
  // Explains: Serialize the date as a Firestore Timestamp rather than locale-dependent text.
  'preferredDate': const FirestoreDate().toJson(instance.preferredDate),
  // Explains: Define or use the stable string mapping for persisted lifecycle enum values.
  'status': _$JobStatusEnumMap[instance.status]!,
  // Explains: Map assignedWorkerId (the selected worker UID, absent before assignment) between the serialized record and typed model, preserving declared defaults.
  'assignedWorkerId': instance.assignedWorkerId,
  // Explains: Map applicationCount (the server-maintained quote count) between the serialized record and typed model, preserving declared defaults.
  'applicationCount': instance.applicationCount,
  // Explains: Map completionRequested (whether the worker has requested client confirmation) between the serialized record and typed model, preserving declared defaults.
  'completionRequested': instance.completionRequested,
  // Explains: Serialize the date as a Firestore Timestamp rather than locale-dependent text.
  'createdAt': const FirestoreDate().toJson(instance.createdAt),
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
};

// Explains: Define or use the stable string mapping for persisted lifecycle enum values.
const _$JobStatusEnumMap = {
  // Explains: Define allowed successors of draft; an empty set makes the state terminal.
  JobStatus.draft: 'draft',
  // Explains: Define allowed successors of open; an empty set makes the state terminal.
  JobStatus.open: 'open',
  // Explains: Define allowed successors of assigned; an empty set makes the state terminal.
  JobStatus.assigned: 'assigned',
  // Explains: Define allowed successors of inProgress; an empty set makes the state terminal.
  JobStatus.inProgress: 'inProgress',
  // Explains: Define allowed successors of completed; an empty set makes the state terminal.
  JobStatus.completed: 'completed',
  // Explains: Define allowed successors of reviewed; an empty set makes the state terminal.
  JobStatus.reviewed: 'reviewed',
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
};

// Explains: Map between this generated concrete model and its serialized field representation.
_Application _$ApplicationFromJson(Map<String, dynamic> json) => _Application(
  // Explains: Map id (the document identifier, supplied separately from Firestore data) between the serialized record and typed model, preserving declared defaults.
  id: json['id'] as String,
  // Explains: Map jobId (the job linking this record to the marketplace lifecycle) between the serialized record and typed model, preserving declared defaults.
  jobId: json['jobId'] as String,
  // Explains: Map workerId (the UID of the worker submitting the quote) between the serialized record and typed model, preserving declared defaults.
  workerId: json['workerId'] as String,
  // Explains: Map message (the text displayed or sent for this item) between the serialized record and typed model, preserving declared defaults.
  message: json['message'] as String,
  // Explains: Map quotedPriceMinor (the quote in integer currency subunits) between the serialized record and typed model, preserving declared defaults.
  quotedPriceMinor: (json['quotedPriceMinor'] as num).toInt(),
  // Explains: Map currency (the currency code, initially LKR) between the serialized record and typed model, preserving declared defaults.
  currency: json['currency'] as String? ?? 'LKR',
  // Explains: Map status (the persisted lifecycle state) between the serialized record and typed model, preserving declared defaults.
  status:
      // Explains: Resolve a stored state string to its enum value, using the declared fallback when nullable.
      $enumDecodeNullable(_$ApplicationStatusEnumMap, json['status']) ??
      // Explains: Associate this enum value with its database string; renaming requires coordinated data migration.
      ApplicationStatus.pending,
  // Explains: Convert the stored timestamp through the shared UTC date converter.
  createdAt: const FirestoreDate().fromJson(json['createdAt'] as Object),
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
);

// Explains: Map between this generated concrete model and its serialized field representation.
Map<String, dynamic> _$ApplicationToJson(_Application instance) =>
    // Explains: Begin the serialized field map consumed by Firestore/model conversion.
    <String, dynamic>{
      // Explains: Map id (the document identifier, supplied separately from Firestore data) between the serialized record and typed model, preserving declared defaults.
      'id': instance.id,
      // Explains: Map jobId (the job linking this record to the marketplace lifecycle) between the serialized record and typed model, preserving declared defaults.
      'jobId': instance.jobId,
      // Explains: Map workerId (the UID of the worker submitting the quote) between the serialized record and typed model, preserving declared defaults.
      'workerId': instance.workerId,
      // Explains: Map message (the text displayed or sent for this item) between the serialized record and typed model, preserving declared defaults.
      'message': instance.message,
      // Explains: Map quotedPriceMinor (the quote in integer currency subunits) between the serialized record and typed model, preserving declared defaults.
      'quotedPriceMinor': instance.quotedPriceMinor,
      // Explains: Map currency (the currency code, initially LKR) between the serialized record and typed model, preserving declared defaults.
      'currency': instance.currency,
      // Explains: Define or use the stable string mapping for persisted lifecycle enum values.
      'status': _$ApplicationStatusEnumMap[instance.status]!,
      // Explains: Serialize the date as a Firestore Timestamp rather than locale-dependent text.
      'createdAt': const FirestoreDate().toJson(instance.createdAt),
    // Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
    };

// Explains: Define or use the stable string mapping for persisted lifecycle enum values.
const _$ApplicationStatusEnumMap = {
  // Explains: Associate this enum value with its database string; renaming requires coordinated data migration.
  ApplicationStatus.pending: 'pending',
  // Explains: Associate this enum value with its database string; renaming requires coordinated data migration.
  ApplicationStatus.accepted: 'accepted',
  // Explains: Associate this enum value with its database string; renaming requires coordinated data migration.
  ApplicationStatus.rejected: 'rejected',
  // Explains: Associate this enum value with its database string; renaming requires coordinated data migration.
  ApplicationStatus.cancelled: 'cancelled',
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
};

// Explains: Map between this generated concrete model and its serialized field representation.
_Chat _$ChatFromJson(Map<String, dynamic> json) => _Chat(
  // Explains: Map id (the document identifier, supplied separately from Firestore data) between the serialized record and typed model, preserving declared defaults.
  id: json['id'] as String,
  // Explains: Map jobId (the job linking this record to the marketplace lifecycle) between the serialized record and typed model, preserving declared defaults.
  jobId: json['jobId'] as String,
  // Explains: Map participants (the two distinct UIDs permitted in this chat) between the serialized record and typed model, preserving declared defaults.
  participants: (json['participants'] as List<dynamic>)
      // Explains: Convert each stored participant value to a UID string; invalid element types fail deserialization.
      .map((e) => e as String)
      // Explains: Materialize converted values into the list required by the model constructor.
      .toList(),
  // Explains: Map lastMessage (the chat-list message preview) between the serialized record and typed model, preserving declared defaults.
  lastMessage: json['lastMessage'] as String? ?? '',
  // Explains: Convert the stored timestamp through the shared UTC date converter.
  lastAt: const FirestoreDate().fromJson(json['lastAt'] as Object),
  // Explains: Map unread (per-participant unread-message counts) between the serialized record and typed model, preserving declared defaults.
  unread:
      // Explains: Convert the stored collection to its declared element types and apply the following fallback if absent.
      (json['unread'] as Map<String, dynamic>?)?.map(
        // Explains: Keep each participant UID key and convert its unread count from stored numeric data to an integer.
        (k, e) => MapEntry(k, (e as num).toInt()),
      // Explains: Finish the nullable conversion and select the following fallback if the stored field is absent.
      ) ??
      // Explains: Use an empty immutable map when no entries were supplied.
      const {},
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
);

// Explains: Map between this generated concrete model and its serialized field representation.
Map<String, dynamic> _$ChatToJson(_Chat instance) => <String, dynamic>{
  // Explains: Map id (the document identifier, supplied separately from Firestore data) between the serialized record and typed model, preserving declared defaults.
  'id': instance.id,
  // Explains: Map jobId (the job linking this record to the marketplace lifecycle) between the serialized record and typed model, preserving declared defaults.
  'jobId': instance.jobId,
  // Explains: Map participants (the two distinct UIDs permitted in this chat) between the serialized record and typed model, preserving declared defaults.
  'participants': instance.participants,
  // Explains: Map lastMessage (the chat-list message preview) between the serialized record and typed model, preserving declared defaults.
  'lastMessage': instance.lastMessage,
  // Explains: Serialize the date as a Firestore Timestamp rather than locale-dependent text.
  'lastAt': const FirestoreDate().toJson(instance.lastAt),
  // Explains: Map unread (per-participant unread-message counts) between the serialized record and typed model, preserving declared defaults.
  'unread': instance.unread,
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
};

// Explains: Map between this generated concrete model and its serialized field representation.
_ChatMessage _$ChatMessageFromJson(Map<String, dynamic> json) => _ChatMessage(
  // Explains: Map id (the document identifier, supplied separately from Firestore data) between the serialized record and typed model, preserving declared defaults.
  id: json['id'] as String,
  // Explains: Map senderId (the message author UID) between the serialized record and typed model, preserving declared defaults.
  senderId: json['senderId'] as String,
  // Explains: Map text (the written message or review) between the serialized record and typed model, preserving declared defaults.
  text: json['text'] as String? ?? '',
  // Explains: Map imageUrl (the optional attached image URL) between the serialized record and typed model, preserving declared defaults.
  imageUrl: json['imageUrl'] as String?,
  // Explains: Convert the stored timestamp through the shared UTC date converter.
  sentAt: const FirestoreDate().fromJson(json['sentAt'] as Object),
  // Explains: Map readBy (the UIDs that have read the message) between the serialized record and typed model, preserving declared defaults.
  readBy:
      // Explains: Convert the stored collection to its declared element types and apply the following fallback if absent.
      (json['readBy'] as List<dynamic>?)?.map((e) => e as String).toList() ??
      // Explains: Use an empty immutable collection when the serialized field is missing.
      const [],
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
);

// Explains: Map between this generated concrete model and its serialized field representation.
Map<String, dynamic> _$ChatMessageToJson(_ChatMessage instance) =>
    // Explains: Begin the serialized field map consumed by Firestore/model conversion.
    <String, dynamic>{
      // Explains: Map id (the document identifier, supplied separately from Firestore data) between the serialized record and typed model, preserving declared defaults.
      'id': instance.id,
      // Explains: Map senderId (the message author UID) between the serialized record and typed model, preserving declared defaults.
      'senderId': instance.senderId,
      // Explains: Map text (the written message or review) between the serialized record and typed model, preserving declared defaults.
      'text': instance.text,
      // Explains: Map imageUrl (the optional attached image URL) between the serialized record and typed model, preserving declared defaults.
      'imageUrl': instance.imageUrl,
      // Explains: Serialize the date as a Firestore Timestamp rather than locale-dependent text.
      'sentAt': const FirestoreDate().toJson(instance.sentAt),
      // Explains: Map readBy (the UIDs that have read the message) between the serialized record and typed model, preserving declared defaults.
      'readBy': instance.readBy,
    // Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
    };

// Explains: Map between this generated concrete model and its serialized field representation.
_Review _$ReviewFromJson(Map<String, dynamic> json) => _Review(
  // Explains: Map id (the document identifier, supplied separately from Firestore data) between the serialized record and typed model, preserving declared defaults.
  id: json['id'] as String,
  // Explains: Map jobId (the job linking this record to the marketplace lifecycle) between the serialized record and typed model, preserving declared defaults.
  jobId: json['jobId'] as String,
  // Explains: Map raterId (the UID writing the review) between the serialized record and typed model, preserving declared defaults.
  raterId: json['raterId'] as String,
  // Explains: Map rateeId (the UID receiving the review) between the serialized record and typed model, preserving declared defaults.
  rateeId: json['rateeId'] as String,
  // Explains: Map stars (the numeric star rating) between the serialized record and typed model, preserving declared defaults.
  stars: (json['stars'] as num).toInt(),
  // Explains: Map text (the written message or review) between the serialized record and typed model, preserving declared defaults.
  text: json['text'] as String? ?? '',
  // Explains: Convert the stored timestamp through the shared UTC date converter.
  createdAt: const FirestoreDate().fromJson(json['createdAt'] as Object),
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
);

// Explains: Map between this generated concrete model and its serialized field representation.
Map<String, dynamic> _$ReviewToJson(_Review instance) => <String, dynamic>{
  // Explains: Map id (the document identifier, supplied separately from Firestore data) between the serialized record and typed model, preserving declared defaults.
  'id': instance.id,
  // Explains: Map jobId (the job linking this record to the marketplace lifecycle) between the serialized record and typed model, preserving declared defaults.
  'jobId': instance.jobId,
  // Explains: Map raterId (the UID writing the review) between the serialized record and typed model, preserving declared defaults.
  'raterId': instance.raterId,
  // Explains: Map rateeId (the UID receiving the review) between the serialized record and typed model, preserving declared defaults.
  'rateeId': instance.rateeId,
  // Explains: Map stars (the numeric star rating) between the serialized record and typed model, preserving declared defaults.
  'stars': instance.stars,
  // Explains: Map text (the written message or review) between the serialized record and typed model, preserving declared defaults.
  'text': instance.text,
  // Explains: Serialize the date as a Firestore Timestamp rather than locale-dependent text.
  'createdAt': const FirestoreDate().toJson(instance.createdAt),
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
};
