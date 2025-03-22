// Create an S3 bucket
export const bucket = new sst.aws.Bucket("Uploads");

// Create a DynamoDB table
export const table = new sst.aws.Dynamo("Notes", {
    fields: {
        userId: "string",
        noteId: "string",
    },
    primaryIndex: { hashKey: "userId", rangeKey: "noteId" },
});

// Create the Users table
export const users = new sst.aws.Dynamo("Users", {
    fields: {
        userId: "string",
        email: "string",
        // name: "string",
        // createdAt: "string",
        // updatedAt: "string",
    },
    primaryIndex: { hashKey: "userId", rangeKey: "email" },
});

// Create the CalendarEvents table
export const calendarevents = new sst.aws.Dynamo("CalendarEvents", {
    fields: {
        userId: "string",
        eventId: "string",
        calendarId: "string",
        // title: "string",
        // description: "string",
        start: "string",
        end: "string",
        // location: "string",
        // organizer: "string",
        // attendees: "string",
        // recurrence: "string",
        status: "string",
        createdAt: "string",
        // updatedAt: "string",
    },
    primaryIndex: { hashKey: "userId", rangeKey: "eventId" },
    globalIndexes: {
        CreatedAtIndex: { hashKey: "userId", rangeKey: "createdAt" },
        CalendarIdIndex: { hashKey: "userId", rangeKey: "calendarId" },
        StatusIndex: { hashKey: "userId", rangeKey: "status" },
        StartAtIndex: { hashKey: "userId", rangeKey: "start" },
        EndAtIndex: { hashKey: "userId", rangeKey: "end" },
    },
});

// Create the TODOs table
export const todos = new sst.aws.Dynamo("Todos", {
    fields: {
        userId: "string",
        todoId: "string",
        category: "string",
        // title: "string",
        // description: "string",
        dueDate: "string",
        completed: "string",
        // createdAt: "string",
        // updatedAt: "string",
    },
    primaryIndex: { hashKey: "userId", rangeKey: "todoId" },
    globalIndexes: {
        CategoryIndex: { hashKey: "userId", rangeKey: "category" },
        DueDateIndex: { hashKey: "userId", rangeKey: "dueDate" },
        CompletedIndex: { hashKey: "userId", rangeKey: "completed" },
    },
});



