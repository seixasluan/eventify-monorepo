export interface EventInput {
  title: string;
  description: string;
  date: string;
  price: string | number;
  imageUrl: string;
  totalTickets: number | string;
  location: string;
}

function parseDateFromYYYYMMDD(input: string): Date | null {
  console.log("inicio: ", input);
  const parts = input.split("-");
  if (parts.length !== 3) return null;

  const [year, month, day] = parts;

  if (isNaN(Number(day)) || isNaN(Number(month)) || isNaN(Number(year))) {
    return null;
  }

  const isoString = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;

  const parsed = new Date(isoString);
  if (isNaN(parsed.getTime())) {
    return null;
  }
  console.log("final: ", parsed);
  return parsed;
}

export function validateEventInput(data: any): {
  valid: boolean;
  errors: string[];
  parsedTotalTickets?: number;
  parsedDate?: Date;
} {
  const errors: string[] = [];
  let parsedTotalTickets: number | undefined;
  let parsedDate: Date | undefined;

  // title
  if (!data.title || typeof data.title !== "string") {
    errors.push("Title is required.");
  }

  // description
  if (!data.description || typeof data.description !== "string") {
    errors.push("Description is required.");
  }

  // date
  if (!data.date || typeof data.date !== "string") {
    errors.push("Date is required.");
  } else {
    const maybeDate = parseDateFromYYYYMMDD(data.date);
    if (!maybeDate) {
      errors.push("Invalid date format. Use DD-MM-YYYY.");
    } else {
      parsedDate = maybeDate;
    }
  }

  // price
  if (data.price === undefined || data.price === null) {
    errors.push("Price is required.");
  } else {
    const parsedPrice = parseFloat(data.price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      errors.push("Price must be a valid, positive number.");
    }
  }

  // image
  if (!data.imageUrl || typeof data.imageUrl !== "string") {
    errors.push("Image URL is required.");
  }

  // location
  if (!data.location || typeof data.location !== "string") {
    errors.push("Location is required.");
  }

  // totalTickets
  if (data.totalTickets === undefined || data.totalTickets === null) {
    errors.push("totalTickets is required.");
  } else {
    const parsed = parseInt(data.totalTickets);
    if (isNaN(parsed) || parsed <= 0) {
      errors.push("totalTickets must be integer and positive number.");
    } else {
      parsedTotalTickets = parsed;
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    parsedTotalTickets,
    parsedDate,
  };
}
