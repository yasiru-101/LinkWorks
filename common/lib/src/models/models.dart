// Shared data contracts used by all five member packages; proposed foundation, not a finalized backend.
// Change model fields here, then run dart run build_runner build from common/.
// Never edit models.freezed.dart or models.g.dart by hand; generation overwrites those files.
// A coordinates users; B coordinates geo/workers; C coordinates jobs/applications; D coordinates chats; E coordinates reviews.
// Coordinate schema changes with readers, writers, rules, and model round-trip tests.
// Fields ending in Minor store integer currency subunits: LKR 100.00 is 10000.
// fromFirestore receives the document ID separately; toFirestore excludes that ID from document data.
// Converters serialize data only. They do not enforce permissions or business validation.

// Explains: Import Firestore native Timestamp support used in persisted model conversion.
import 'package:cloud_firestore/cloud_firestore.dart';
// Explains: Import model and JSON annotations consumed by the code generators.
import 'package:freezed_annotation/freezed_annotation.dart';

// Explains: Include generated model support; regenerate this referenced file after changing model declarations.
part 'models.freezed.dart';
// Explains: Include generated model support; regenerate this referenced file after changing model declarations.
part 'models.g.dart';

// Explains: List the two UI roles; a user may hold both through separate profile flags.
enum AppRole { client, worker }
// Enum names are persisted as strings. Renaming them requires a data migration.
// Explains: Declare persisted job states; allowed transitions are maintained by Member C.
enum JobStatus { draft, open, assigned, inProgress, completed, reviewed }
// Explains: Declare the pending, accepted, rejected, and withdrawn quote states.
enum ApplicationStatus { pending, accepted, rejected, cancelled }

/// All persisted dates are UTC Firestore timestamps, not device-formatted text.
// Explains: Define the named type and the methods that implement its documented responsibility.
class FirestoreDate implements JsonConverter<DateTime, Object> {
  // Explains: Make this stateless converter usable as a const annotation on persisted model date fields.
  const FirestoreDate();

  // Explains: Implement an inherited interface method or property instead of defining an unrelated API.
  @override
  // Explains: Dispatch incoming date values by type and normalize supported values to UTC.
  DateTime fromJson(Object value) => switch (value) {
    // Firestore provides Timestamp; tests/imports may provide DateTime or ISO text.
    // Explains: Convert a Firestore Timestamp into the UTC DateTime used by the app.
    Timestamp() => value.toDate().toUtc(),
    // Explains: Normalize an existing DateTime to UTC without changing the represented instant.
    DateTime() => value.toUtc(),
    // Explains: Parse an ISO date string, then normalize it to UTC for consistent model values.
    String() => DateTime.parse(value).toUtc(),
    // Explains: Stop this operation with an explicit error because the input or model variant is unsupported.
    _ => throw FormatException('Expected a Firestore timestamp', value),
  // Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
  };

  // Explains: Implement an inherited interface method or property instead of defining an unrelated API.
  @override
  // Explains: Convert the UTC date to Firestore native timestamp representation on writes.
  Object toJson(DateTime value) => Timestamp.fromDate(value.toUtc());
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

/// One coordinate contract for users, worker bases, and jobs.
// Explains: Ask Freezed to generate immutable model implementations, equality, and copyWith support.
@freezed
// Explains: Declare the editable shared model contract implemented by generated Freezed code.
abstract class GeoLocation with _$GeoLocation {
  // Explains: Declare the immutable model constructor and its accepted fields/defaults.
  const factory GeoLocation({
    // Explains: Declare/configure lat: latitude in decimal degrees.
    required double lat,
    // Explains: Declare/configure lng: longitude in decimal degrees.
    required double lng,
    // Explains: Declare/configure geohash: the spatial prefix used to narrow location searches.
    required String geohash,
  // Explains: Bind the public factory to the generated immutable implementation.
  }) = _GeoLocation;
  // Explains: Delegate field parsing to the generated JSON deserializer for this model.
  factory GeoLocation.fromJson(Map<String, dynamic> json) => _$GeoLocationFromJson(json);
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Ask Freezed to generate immutable model implementations, equality, and copyWith support.
@freezed
// Explains: Declare the editable shared model contract implemented by generated Freezed code.
abstract class UserModel with _$UserModel {
  // Public profile only. Phone numbers and device tokens need private storage.
  // Explains: Provide the private model constructor required for custom methods alongside Freezed generation.
  const UserModel._();
  // Explains: Declare the immutable model constructor and its accepted fields/defaults.
  const factory UserModel({
    // Explains: Declare/configure id: the document identifier, supplied separately from Firestore data.
    required String id,
    // Explains: Declare/configure name: the display name shown to other users.
    required String name,
    // Explains: Declare/configure isClient: whether the account has the client role.
    @Default(false) bool isClient,
    // Explains: Declare/configure isWorker: whether the account has the worker role.
    @Default(false) bool isWorker,
    // Explains: Declare/configure onboardingComplete: whether required profile setup is finished.
    @Default(false) bool onboardingComplete,
    // Explains: Declare/configure photoUrl: the optional profile-photo URL.
    String? photoUrl,
    // Explains: Declare/configure city: the selected city.
    String? city,
    // Explains: Declare/configure geo: the location used for nearby matching.
    GeoLocation? geo,
    // Explains: Declare/configure createdAt: the creation time stored in UTC.
    @FirestoreDate() required DateTime createdAt,
  // Explains: Bind the public factory to the generated immutable implementation.
  }) = _UserModel;
  // Explains: Delegate field parsing to the generated JSON deserializer for this model.
  factory UserModel.fromJson(Map<String, dynamic> json) => _$UserModelFromJson(json);
  // Explains: Deserialize document data while supplying the authoritative document ID separately.
  factory UserModel.fromFirestore(String id, Map<String, dynamic> data) =>
      // Explains: Overlay the path-derived ID so an id field inside stored data cannot replace it.
      UserModel.fromJson({...data, 'id': id});
  // Explains: Produce document fields and remove the ID because Firestore stores it in the document path.
  Map<String, dynamic> toFirestore() => toJson()..remove('id');
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Ask Freezed to generate immutable model implementations, equality, and copyWith support.
@freezed
// Explains: Declare the editable shared model contract implemented by generated Freezed code.
abstract class WorkerProfile with _$WorkerProfile {
  // Service radius is kilometres; skills contain category IDs, not display labels.
  // Explains: Provide the private model constructor required for custom methods alongside Freezed generation.
  const WorkerProfile._();
  // Explains: Declare the immutable model constructor and its accepted fields/defaults.
  const factory WorkerProfile({
    // Explains: Declare/configure id: the document identifier, supplied separately from Firestore data.
    required String id,
    // Explains: Declare/configure skills: category IDs describing the worker skills.
    @Default([]) List<String> skills,
    // Explains: Declare/configure bio: the worker introduction.
    @Default('') String bio,
    // Explains: Declare/configure experienceYears: years of relevant experience.
    @Default(0) int experienceYears,
    // Explains: Declare/configure dayRateMinor: the daily rate in integer currency subunits.
    required int dayRateMinor,
    // Explains: Declare/configure currency: the currency code, initially LKR.
    @Default('LKR') String currency,
    // Explains: Declare/configure base: the worker base location.
    required GeoLocation base,
    // Explains: Declare/configure serviceRadiusKm: the maximum travel radius in kilometres.
    required double serviceRadiusKm,
    // Explains: Declare/configure portfolio: the worker portfolio image URLs.
    @Default([]) List<String> portfolio,
    // Backend-owned reputation/verification fields; do not trust client writes.
    // Explains: Declare/configure ratingAvg: the server-maintained average rating.
    @Default(0) double ratingAvg,
    // Explains: Declare/configure ratingCount: the server-maintained number of ratings.
    @Default(0) int ratingCount,
    // Explains: Declare/configure jobsCompleted: the server-maintained completed-job count.
    @Default(0) int jobsCompleted,
    // Explains: Declare/configure isAvailable: whether the worker is currently available.
    @Default(false) bool isAvailable,
    // Explains: Declare/configure isVerified: the server-controlled verification flag.
    @Default(false) bool isVerified,
  // Explains: Bind the public factory to the generated immutable implementation.
  }) = _WorkerProfile;
  // Explains: Delegate field parsing to the generated JSON deserializer for this model.
  factory WorkerProfile.fromJson(Map<String, dynamic> json) => _$WorkerProfileFromJson(json);
  // Explains: Deserialize document data while supplying the authoritative document ID separately.
  factory WorkerProfile.fromFirestore(String id, Map<String, dynamic> data) =>
      // Explains: Overlay the path-derived ID so an id field inside stored data cannot replace it.
      WorkerProfile.fromJson({...data, 'id': id});
  // Explains: Produce document fields and remove the ID because Firestore stores it in the document path.
  Map<String, dynamic> toFirestore() => toJson()..remove('id');
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Ask Freezed to generate immutable model implementations, equality, and copyWith support.
@freezed
// Explains: Declare the editable shared model contract implemented by generated Freezed code.
abstract class Category with _$Category {
  // Keep stored locale keys stable even if Dart property names change.
  // Explains: Provide the private model constructor required for custom methods alongside Freezed generation.
  const Category._();
  // Explains: Declare the immutable model constructor and its accepted fields/defaults.
  const factory Category({
    // Explains: Declare/configure id: the document identifier, supplied separately from Firestore data.
    required String id,
    // Explains: Specify the persisted JSON key or whether the following member participates in serialization.
    @JsonKey(name: 'name_en') required String nameEn,
    // Explains: Specify the persisted JSON key or whether the following member participates in serialization.
    @JsonKey(name: 'name_si') @Default('') String nameSi,
    // Explains: Specify the persisted JSON key or whether the following member participates in serialization.
    @JsonKey(name: 'name_ta') @Default('') String nameTa,
    // Explains: Declare/configure icon: the icon used to represent this item.
    required String icon,
  // Explains: Bind the public factory to the generated immutable implementation.
  }) = _Category;
  // Explains: Delegate field parsing to the generated JSON deserializer for this model.
  factory Category.fromJson(Map<String, dynamic> json) => _$CategoryFromJson(json);
  // Explains: Deserialize document data while supplying the authoritative document ID separately.
  factory Category.fromFirestore(String id, Map<String, dynamic> data) =>
      // Explains: Overlay the path-derived ID so an id field inside stored data cannot replace it.
      Category.fromJson({...data, 'id': id});
  // Explains: Produce document fields and remove the ID because Firestore stores it in the document path.
  Map<String, dynamic> toFirestore() => toJson()..remove('id');
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Ask Freezed to generate immutable model implementations, equality, and copyWith support.
@freezed
// Explains: Declare the editable shared model contract implemented by generated Freezed code.
abstract class Job with _$Job {
  // This is the marketplace record tying applications, assignment, chat, and reviews together.
  // Explains: Provide the private model constructor required for custom methods alongside Freezed generation.
  const Job._();
  // Explains: Declare the immutable model constructor and its accepted fields/defaults.
  const factory Job({
    // Explains: Declare/configure id: the document identifier, supplied separately from Firestore data.
    required String id,
    // Explains: Declare/configure clientId: the UID of the client who owns the job.
    required String clientId,
    // Explains: Declare/configure title: the visible title.
    required String title,
    // Explains: Declare/configure description: the description of the requested work.
    required String description,
    // Explains: Declare/configure categoryId: the category used for skill matching.
    required String categoryId,
    // Explains: Declare/configure photos: the job photo URLs.
    @Default([]) List<String> photos,
    // Explains: Declare/configure budgetMinMinor: the lower budget in integer currency subunits.
    required int budgetMinMinor,
    // Explains: Declare/configure budgetMaxMinor: the upper budget in integer currency subunits.
    required int budgetMaxMinor,
    // Explains: Declare/configure currency: the currency code, initially LKR.
    @Default('LKR') String currency,
    // Explains: Declare/configure geo: the location used for nearby matching.
    required GeoLocation geo,
    // Explains: Declare/configure addressText: the human-readable work address.
    required String addressText,
    // Explains: Declare/configure preferredDate: the preferred work date.
    @FirestoreDate() required DateTime preferredDate,
    // Explains: Declare/configure status: the persisted lifecycle state.
    @Default(JobStatus.draft) JobStatus status,
    // Explains: Declare/configure assignedWorkerId: the selected worker UID, absent before assignment.
    String? assignedWorkerId,
    // Explains: Declare/configure applicationCount: the server-maintained quote count.
    @Default(0) int applicationCount,
    // A worker request is separate from the client's confirmation of completion.
    // Explains: Declare/configure completionRequested: whether the worker has requested client confirmation.
    @Default(false) bool completionRequested,
    // Explains: Declare/configure createdAt: the creation time stored in UTC.
    @FirestoreDate() required DateTime createdAt,
  // Explains: Bind the public factory to the generated immutable implementation.
  }) = _Job;
  // Explains: Delegate field parsing to the generated JSON deserializer for this model.
  factory Job.fromJson(Map<String, dynamic> json) => _$JobFromJson(json);
  // Explains: Deserialize document data while supplying the authoritative document ID separately.
  factory Job.fromFirestore(String id, Map<String, dynamic> data) =>
      // Explains: Overlay the path-derived ID so an id field inside stored data cannot replace it.
      Job.fromJson({...data, 'id': id});
  // Explains: Produce document fields and remove the ID because Firestore stores it in the document path.
  Map<String, dynamic> toFirestore() => toJson()..remove('id');
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Ask Freezed to generate immutable model implementations, equality, and copyWith support.
@freezed
// Explains: Declare the editable shared model contract implemented by generated Freezed code.
abstract class Application with _$Application {
  // The document lives under jobs/{jobId}/applications/{workerId}.
  // Carry jobId and workerId in data as well to support collection-group queries.
  // Explains: Provide the private model constructor required for custom methods alongside Freezed generation.
  const Application._();
  // Explains: Declare the immutable model constructor and its accepted fields/defaults.
  const factory Application({
    // Explains: Declare/configure id: the document identifier, supplied separately from Firestore data.
    required String id,
    // Explains: Declare/configure jobId: the job linking this record to the marketplace lifecycle.
    required String jobId,
    // Explains: Declare/configure workerId: the UID of the worker submitting the quote.
    required String workerId,
    // Explains: Declare/configure message: the text displayed or sent for this item.
    required String message,
    // Explains: Declare/configure quotedPriceMinor: the quote in integer currency subunits.
    required int quotedPriceMinor,
    // Explains: Declare/configure currency: the currency code, initially LKR.
    @Default('LKR') String currency,
    // Explains: Declare/configure status: the persisted lifecycle state.
    @Default(ApplicationStatus.pending) ApplicationStatus status,
    // Explains: Declare/configure createdAt: the creation time stored in UTC.
    @FirestoreDate() required DateTime createdAt,
  // Explains: Bind the public factory to the generated immutable implementation.
  }) = _Application;
  // Explains: Delegate field parsing to the generated JSON deserializer for this model.
  factory Application.fromJson(Map<String, dynamic> json) => _$ApplicationFromJson(json);
  // Explains: Deserialize document data while supplying the authoritative document ID separately.
  factory Application.fromFirestore(String id, Map<String, dynamic> data) =>
      // Explains: Overlay the path-derived ID so an id field inside stored data cannot replace it.
      Application.fromJson({...data, 'id': id});
  // Explains: Produce document fields and remove the ID because Firestore stores it in the document path.
  Map<String, dynamic> toFirestore() => toJson()..remove('id');
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Ask Freezed to generate immutable model implementations, equality, and copyWith support.
@freezed
// Explains: Declare the editable shared model contract implemented by generated Freezed code.
abstract class Chat with _$Chat {
  // A job ID is required. Backend creation must validate two distinct participants.
  // Explains: Provide the private model constructor required for custom methods alongside Freezed generation.
  const Chat._();
  // Explains: Declare the immutable model constructor and its accepted fields/defaults.
  const factory Chat({
    // Explains: Declare/configure id: the document identifier, supplied separately from Firestore data.
    required String id,
    // Explains: Declare/configure jobId: the job linking this record to the marketplace lifecycle.
    required String jobId,
    // Explains: Declare/configure participants: the two distinct UIDs permitted in this chat.
    required List<String> participants,
    // Explains: Declare/configure lastMessage: the chat-list message preview.
    @Default('') String lastMessage,
    // Explains: Declare/configure lastAt: the time used to order recent chats.
    @FirestoreDate() required DateTime lastAt,
    // Map keys are participant UIDs; actual concurrent updates need transactions.
    // Explains: Declare/configure unread: per-participant unread-message counts.
    @Default({}) Map<String, int> unread,
  // Explains: Bind the public factory to the generated immutable implementation.
  }) = _Chat;
  // Explains: Delegate field parsing to the generated JSON deserializer for this model.
  factory Chat.fromJson(Map<String, dynamic> json) => _$ChatFromJson(json);
  // Explains: Deserialize document data while supplying the authoritative document ID separately.
  factory Chat.fromFirestore(String id, Map<String, dynamic> data) =>
      // Explains: Overlay the path-derived ID so an id field inside stored data cannot replace it.
      Chat.fromJson({...data, 'id': id});
  // Explains: Produce document fields and remove the ID because Firestore stores it in the document path.
  Map<String, dynamic> toFirestore() => toJson()..remove('id');
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Ask Freezed to generate immutable model implementations, equality, and copyWith support.
@freezed
// Explains: Declare the editable shared model contract implemented by generated Freezed code.
abstract class ChatMessage with _$ChatMessage {
  // Supports text or image content; validation of nonempty messages is still needed.
  // Explains: Provide the private model constructor required for custom methods alongside Freezed generation.
  const ChatMessage._();
  // Explains: Declare the immutable model constructor and its accepted fields/defaults.
  const factory ChatMessage({
    // Explains: Declare/configure id: the document identifier, supplied separately from Firestore data.
    required String id,
    // Explains: Declare/configure senderId: the message author UID.
    required String senderId,
    // Explains: Declare/configure text: the written message or review.
    @Default('') String text,
    // Explains: Declare/configure imageUrl: the optional attached image URL.
    String? imageUrl,
    // Explains: Declare/configure sentAt: the message send time.
    @FirestoreDate() required DateTime sentAt,
    // Explains: Declare/configure readBy: the UIDs that have read the message.
    @Default([]) List<String> readBy,
  // Explains: Bind the public factory to the generated immutable implementation.
  }) = _ChatMessage;
  // Explains: Delegate field parsing to the generated JSON deserializer for this model.
  factory ChatMessage.fromJson(Map<String, dynamic> json) => _$ChatMessageFromJson(json);
  // Explains: Deserialize document data while supplying the authoritative document ID separately.
  factory ChatMessage.fromFirestore(String id, Map<String, dynamic> data) =>
      // Explains: Overlay the path-derived ID so an id field inside stored data cannot replace it.
      ChatMessage.fromJson({...data, 'id': id});
  // Explains: Produce document fields and remove the ID because Firestore stores it in the document path.
  Map<String, dynamic> toFirestore() => toJson()..remove('id');
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Ask Freezed to generate immutable model implementations, equality, and copyWith support.
@freezed
// Explains: Declare the editable shared model contract implemented by generated Freezed code.
abstract class Review with _$Review {
  // Backend rules must check completion, participant identity, 1-5 stars, and uniqueness.
  // Model construction alone does not enforce those requirements.
  // Explains: Provide the private model constructor required for custom methods alongside Freezed generation.
  const Review._();
  // Explains: Declare the immutable model constructor and its accepted fields/defaults.
  const factory Review({
    // Explains: Declare/configure id: the document identifier, supplied separately from Firestore data.
    required String id,
    // Explains: Declare/configure jobId: the job linking this record to the marketplace lifecycle.
    required String jobId,
    // Explains: Declare/configure raterId: the UID writing the review.
    required String raterId,
    // Explains: Declare/configure rateeId: the UID receiving the review.
    required String rateeId,
    // Explains: Declare/configure stars: the numeric star rating.
    required int stars,
    // Explains: Declare/configure text: the written message or review.
    @Default('') String text,
    // Explains: Declare/configure createdAt: the creation time stored in UTC.
    @FirestoreDate() required DateTime createdAt,
  // Explains: Bind the public factory to the generated immutable implementation.
  }) = _Review;
  // Explains: Delegate field parsing to the generated JSON deserializer for this model.
  factory Review.fromJson(Map<String, dynamic> json) => _$ReviewFromJson(json);
  // Explains: Deserialize document data while supplying the authoritative document ID separately.
  factory Review.fromFirestore(String id, Map<String, dynamic> data) =>
      // Explains: Overlay the path-derived ID so an id field inside stored data cannot replace it.
      Review.fromJson({...data, 'id': id});
  // Explains: Produce document fields and remove the ID because Firestore stores it in the document path.
  Map<String, dynamic> toFirestore() => toJson()..remove('id');
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
