"use strict";

class Task
{
    constructor(title, completed = false, completeDate = null)
    {
        this.title = title;
        this.completed = completed;
        this.completeDate = completeDate;
    }
};

export {Task as default};