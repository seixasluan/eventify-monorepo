export type UserPublic = {
  id: number;
  name: string;
};

export type Event = {
  id: number;
  title: string;
  description: string;
  date: string;
  price: number;
  imageUrl: string;
  location: string;
  totalTickets: number;
  ticketsSold: number;
  organizerId: number;
  organizer: UserPublic;
};

export type EventResponse = {
  success: true;
  data: {
    events: Event[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
};
