// Shared model contracts: checks Firestore round trips, nested data, timestamps, and absence of public phone/token fields.
// Update these expectations only when the corresponding agreed behavior changes.
// These tests were added during scaffolding; a successful test run has not yet been established.

// Explains: Import Firestore native Timestamp support used in persisted model conversion.
import 'package:cloud_firestore/cloud_firestore.dart';
// Explains: Import the test runner, widget tester, expectations, and matchers.
import 'package:flutter_test/flutter_test.dart';
// Explains: Import shared model contracts, constants, theme, and reusable UI components.
import 'package:linkworks_common/linkworks_common.dart';
// Explains: Register this file tests with the test runner.
void main() {
  // Explains: Use a fixed UTC timestamp so serialization tests remain deterministic.
  final now = DateTime.utc(2026, 9, 13);
  // Explains: Create a fixed coordinate fixture without requiring GPS permission or a device location.
  const geo = GeoLocation(lat: 6.9271, lng: 79.8612, geohash: 'tc0');
  // Explains: Define the named behavior check; its callback contains the setup and assertions.
  test('job converts nested geo, enums, dates, and money to Firestore data', () {
    // Explains: Create a representative model fixture for the behavior/round-trip assertions that follow.
    final job = Job(id: 'job-1', clientId: 'client', title: 'Repair a door',
      // Explains: Supply description: the description of the requested work; the expression on this line determines its current value.
      description: 'Fix the hinge', categoryId: 'carpentry', budgetMinMinor: 500000,
      // Explains: Supply budgetMaxMinor: the upper budget in integer currency subunits; the expression on this line determines its current value.
      budgetMaxMinor: 800000, geo: geo, addressText: 'Colombo', preferredDate: now,
      // Explains: Supply createdAt: the creation time stored in UTC; the expression on this line determines its current value.
      createdAt: now, status: JobStatus.open);
    // Explains: Serialize the job once so its field shape and round-trip behavior can be inspected.
    final data = job.toFirestore();
    // Explains: Assert that the forbidden state or unavailable UI is absent in this scenario.
    expect(data.containsKey('id'), isFalse);
    // Explains: Assert the stated expected result so a behavior change produces a visible test failure.
    expect(data['geo'], isA<Map<String, dynamic>>());
    // Explains: Assert the stated expected result so a behavior change produces a visible test failure.
    expect(data['createdAt'], isA<Timestamp>());
    // Explains: Assert the stated expected result so a behavior change produces a visible test failure.
    expect(data['status'], 'open');
    // Explains: Check that deserialization restores the original typed model without losing fields.
    expect(Job.fromFirestore('job-1', data), job);
  // Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
  });
  // Explains: Define the named behavior check; its callback contains the setup and assertions.
  test('user has no public phone or device token fields', () {
    // Explains: Create a representative model fixture for the behavior/round-trip assertions that follow.
    final user = UserModel(id: 'client', name: 'Client', createdAt: now, geo: geo);
    // Explains: Check that deserialization restores the original typed model without losing fields.
    expect(UserModel.fromFirestore(user.id, user.toFirestore()), user);
    // Explains: Assert that the forbidden state or unavailable UI is absent in this scenario.
    expect(user.toFirestore().containsKey('phone'), isFalse);
    // Explains: Assert that the forbidden state or unavailable UI is absent in this scenario.
    expect(user.toFirestore().containsKey('fcmToken'), isFalse);
  // Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
  });
  // Explains: Define the named behavior check; its callback contains the setup and assertions.
  test('all remaining models round trip', () {
    // Explains: Create a representative model fixture for the behavior/round-trip assertions that follow.
    final worker = WorkerProfile(id: 'worker', dayRateMinor: 500000, base: geo, serviceRadiusKm: 15);
    // Explains: Check that deserialization restores the original typed model without losing fields.
    expect(WorkerProfile.fromFirestore(worker.id, worker.toFirestore()), worker);
    // Explains: Create a representative model fixture for the behavior/round-trip assertions that follow.
    const category = Category(id: 'carpentry', nameEn: 'Carpentry', icon: 'handyman');
    // Explains: Check that deserialization restores the original typed model without losing fields.
    expect(Category.fromFirestore(category.id, category.toFirestore()), category);
    // Explains: Create a representative model fixture for the behavior/round-trip assertions that follow.
    final application = Application(id: 'worker', jobId: 'job', workerId: 'worker',
      // Explains: Supply message: the text displayed or sent for this item; the expression on this line determines its current value.
      message: 'I can help', quotedPriceMinor: 500000, createdAt: now);
    // Explains: Check that deserialization restores the original typed model without losing fields.
    expect(Application.fromFirestore(application.id, application.toFirestore()), application);
    // Explains: Create a representative model fixture for the behavior/round-trip assertions that follow.
    final chat = Chat(id: 'chat', jobId: 'job', participants: ['client', 'worker'], lastAt: now);
    // Explains: Check that deserialization restores the original typed model without losing fields.
    expect(Chat.fromFirestore(chat.id, chat.toFirestore()), chat);
    // Explains: Create a representative model fixture for the behavior/round-trip assertions that follow.
    final message = ChatMessage(id: 'message', senderId: 'client', text: 'Hello', sentAt: now);
    // Explains: Check that deserialization restores the original typed model without losing fields.
    expect(ChatMessage.fromFirestore(message.id, message.toFirestore()), message);
    // Explains: Create a representative model fixture for the behavior/round-trip assertions that follow.
    final review = Review(id: 'review', jobId: 'job', raterId: 'client', rateeId: 'worker', stars: 5, createdAt: now);
    // Explains: Check that deserialization restores the original typed model without losing fields.
    expect(Review.fromFirestore(review.id, review.toFirestore()), review);
  // Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
  });
// Explains: Close the preceding argument list, collection, or code block; no additional action runs here.
}
