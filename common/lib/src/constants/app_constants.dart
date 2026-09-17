// Shared names and limits imported by all member packages.
// Edit app-wide labels and page/photo limits here rather than repeating values in screens.
// Route constants currently cover the welcome and development preview only.
// Collection names describe planned paths; declaring a constant does not create a collection or grant access.

// Explains: Group shared static settings or helpers; callers do not create instances of this class.
abstract final class AppConstants {
  // Explains: Keep the app name in one place for shared titles.
  static const name = 'LinkWorks';
  // Explains: Use Sri Lankan rupees as the initial app currency.
  static const currency = 'LKR';
  // Explains: Limit each feed page to 20 records to bound queries and scrolling work.
  static const feedPageSize = 20;
  // Explains: Load chat history in pages of 30 messages.
  static const messagePageSize = 30;
  // Explains: Limit each worker portfolio to six photos once upload validation is implemented.
  static const maxPortfolioPhotos = 6;
  // Explains: Limit a job post to four photos once form validation is implemented.
  static const maxJobPhotos = 4;
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Group shared static settings or helpers; callers do not create instances of this class.
abstract final class AppRoutes {
  // Explains: Define the root URL for the welcome screen.
  static const welcome = '/';
  // Explains: Define the debug-only navigation preview URL.
  static const preview = '/preview';
  // Explains: Define the debug-only component gallery URL.
  static const designSystem = '/design-system';
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Explains: Group shared static settings or helpers; callers do not create instances of this class.
abstract final class FirestoreCollections {
  // Explains: Name the public user-profile collection; private fields need separate storage.
  static const users = 'users';
  // Explains: Reserve the private account-details collection name; declaring it does not create it or grant access.
  static const privateUsers = 'privateUsers';
  // Explains: Name the worker skills, service-area, portfolio, and reputation collection.
  static const workerProfiles = 'workerProfiles';
  // Explains: Name the category catalog used for discovery and job classification.
  static const categories = 'categories';
  // Explains: Name the collection holding the marketplace job records.
  static const jobs = 'jobs';
  // Explains: Name each job applications subcollection, keyed by worker UID.
  static const applications = 'applications';
  // Explains: Name the collection of job-linked participant conversations.
  static const chats = 'chats';
  // Explains: Name each chat messages subcollection.
  static const messages = 'messages';
  // Explains: Name the completed-job review collection.
  static const reviews = 'reviews';
  // Explains: Name the collection of user-submitted moderation reports.
  static const reports = 'reports';
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}

// Shared upload paths; Members A/C/D own upload implementations and access rules.
abstract final class StoragePaths {
  static String profilePhoto(String userId) => 'users/$userId/profile';
  static String portfolio(String userId) => 'users/$userId/portfolio';
  static String jobPhotos(String clientId, String jobId) => 'jobs/$clientId/$jobId';
  static String chatImages(String chatId) => 'chats/$chatId/images';
}

// Member E maintains consistent fallback copy; feature errors belong to their owner.
abstract final class ErrorStrings {
  static const title = 'Something went wrong';
  static const connection = 'Please check your connection and try again.';
  static const required = 'Please fill in this field.';
}
