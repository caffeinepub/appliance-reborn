import List "mo:core/List";
import Iter "mo:core/Iter";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  type BookingId = Nat;

  type ApplianceType = {
    #WashingMachine;
    #Dryer;
    #Dishwasher;
    #Microwave;
    #Chimney;
    #HobChula;
  };

  type ServiceType = {
    #Repair;
    #Servicing;
    #Installation;
  };

  type BookingStatus = {
    #pending;
    #confirmed;
    #completed;
    #cancelled;
  };

  type BookingRequest = {
    name : Text;
    phone : Text;
    email : Text;
    address : Text;
    applianceType : ApplianceType;
    serviceType : ServiceType;
    preferredDate : Text;
    description : Text;
  };

  type Booking = BookingRequest and {
    id : BookingId;
    timestamp : Int;
    status : BookingStatus;
  };

  type Testimonial = {
    id : Nat;
    author : Text;
    content : Text;
    rating : Nat; // 1-5 stars
    timestamp : Int;
  };

  type BookingCounts = {
    pending : Nat;
    confirmed : Nat;
    completed : Nat;
    cancelled : Nat;
  };

  var nextBookingId : BookingId = 1;
  var nextTestimonialId = 1;

  let bookings = Map.empty<BookingId, Booking>();
  let testimonials = Map.empty<Nat, Testimonial>();

  module Booking {
    public func compare(book1 : Booking, book2 : Booking) : Order.Order {
      Nat.compare(book1.id, book2.id);
    };
  };

  // Initialize authorization system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Bookings
  public shared ({ caller }) func createBooking(request : BookingRequest) : async BookingId {
    let booking : Booking = {
      id = nextBookingId;
      timestamp = Time.now();
      status = #pending;
      name = request.name;
      phone = request.phone;
      email = request.email;
      address = request.address;
      applianceType = request.applianceType;
      serviceType = request.serviceType;
      preferredDate = request.preferredDate;
      description = request.description;
    };
    bookings.add(nextBookingId, booking);
    nextBookingId += 1;
    booking.id;
  };

  public query ({ caller }) func getBookings() : async [Booking] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all bookings");
    };
    bookings.values().toArray().sort();
  };

  public shared ({ caller }) func updateBookingStatus(bookingId : BookingId, status : BookingStatus) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update booking status");
    };
    switch (bookings.get(bookingId)) {
      case (?booking) {
        let updatedBooking : Booking = {
          id = booking.id;
          timestamp = booking.timestamp;
          status;
          name = booking.name;
          phone = booking.phone;
          email = booking.email;
          address = booking.address;
          applianceType = booking.applianceType;
          serviceType = booking.serviceType;
          preferredDate = booking.preferredDate;
          description = booking.description;
        };
        bookings.add(bookingId, updatedBooking);
      };
      case (null) { Runtime.trap("Booking not found") };
    };
  };

  public shared ({ caller }) func deleteBooking(bookingId : BookingId) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete bookings");
    };
    if (not bookings.containsKey(bookingId)) {
      Runtime.trap("Booking not found");
    };
    bookings.remove(bookingId);
  };

  public query ({ caller }) func getBookingCounts() : async BookingCounts {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view booking counts");
    };
    var pending = 0;
    var confirmed = 0;
    var completed = 0;
    var cancelled = 0;

    bookings.values().forEach(
      func(booking) {
        switch (booking.status) {
          case (#pending) { pending += 1 };
          case (#confirmed) { confirmed += 1 };
          case (#completed) { completed += 1 };
          case (#cancelled) { cancelled += 1 };
        };
      }
    );

    {
      pending;
      confirmed;
      completed;
      cancelled;
    };
  };

  // Testimonials
  public shared ({ caller }) func addTestimonial(author : Text, content : Text, rating : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add testimonials");
    };
    if (rating < 1 or rating > 5) {
      Runtime.trap("Rating must be between 1 and 5");
    };

    let testimonial : Testimonial = {
      id = nextTestimonialId;
      author;
      content;
      rating;
      timestamp = Time.now();
    };

    testimonials.add(nextTestimonialId, testimonial);
    nextTestimonialId += 1;
  };

  public query ({ caller }) func getTestimonials() : async [Testimonial] {
    testimonials.values().toArray();
  };

  public shared ({ caller }) func updateTestimonial(id : Nat, author : Text, content : Text, rating : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update testimonials");
    };

    switch (testimonials.get(id)) {
      case (?_) {
        let updatedTestimonial : Testimonial = {
          id;
          author;
          content;
          rating;
          timestamp = Time.now();
        };
        testimonials.add(id, updatedTestimonial);
      };
      case (null) { Runtime.trap("Testimonial not found") };
    };
  };

  public shared ({ caller }) func deleteTestimonial(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete testimonials");
    };
    if (not testimonials.containsKey(id)) {
      Runtime.trap("Testimonial not found");
    };
    testimonials.remove(id);
  };
};
