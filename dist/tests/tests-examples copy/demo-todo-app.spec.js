"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
test_1.test.beforeEach(async ({ page }) => {
    await page.goto("https://demo.playwright.dev/todomvc");
});
const TODO_ITEMS = [
    "buy some cheese",
    "feed the cat",
    "book a doctors appointment",
];
test_1.test.describe("New Todo", () => {
    (0, test_1.test)("I should allow me to add todo items", async ({ page }) => {
        // create a new todo locator
        const newTodo = page.getByPlaceholder("What needs to be done?");
        // Create 1st todo.
        await newTodo.fill(TODO_ITEMS[0]);
        await newTodo.press("Enter");
        // Make sure the list only has one todo item.
        await (0, test_1.expect)(page.getByTestId("todo-title")).toHaveText([
            TODO_ITEMS[0],
        ]);
        // Create 2nd todo.
        await newTodo.fill(TODO_ITEMS[1]);
        await newTodo.press("Enter");
        // Make sure the list now has two todo items.
        await (0, test_1.expect)(page.getByTestId("todo-title")).toHaveText([
            TODO_ITEMS[0],
            TODO_ITEMS[1],
        ]);
        await checkNumberOfTodosInLocalStorage(page, 2);
    });
    (0, test_1.test)("I should clear text input field when an item is added", async ({ page, }) => {
        // create a new todo locator
        const newTodo = page.getByPlaceholder("What needs to be done?");
        // Create one todo item.
        await newTodo.fill(TODO_ITEMS[0]);
        await newTodo.press("Enter");
        // Check that input is empty.
        await (0, test_1.expect)(newTodo).toBeEmpty();
        await checkNumberOfTodosInLocalStorage(page, 1);
    });
    (0, test_1.test)("should append new items to the bottom of the list", async ({ page, }) => {
        // Create 3 items.
        await createDefaultTodos(page);
        // create a todo count locator
        const todoCount = page.getByTestId("todo-count");
        // Check test using different methods.
        await (0, test_1.expect)(page.getByText("3 items left")).toBeVisible();
        await (0, test_1.expect)(todoCount).toHaveText("3 items left");
        await (0, test_1.expect)(todoCount).toContainText("3");
        await (0, test_1.expect)(todoCount).toHaveText(/3/);
        // Check all items in one call.
        await (0, test_1.expect)(page.getByTestId("todo-title")).toHaveText(TODO_ITEMS);
        await checkNumberOfTodosInLocalStorage(page, 3);
    });
});
test_1.test.describe("Mark all as completed", () => {
    test_1.test.beforeEach(async ({ page }) => {
        await createDefaultTodos(page);
        await checkNumberOfTodosInLocalStorage(page, 3);
    });
    test_1.test.afterEach(async ({ page }) => {
        await checkNumberOfTodosInLocalStorage(page, 3);
    });
    (0, test_1.test)("should allow me to mark all items as completed", async ({ page }) => {
        // Complete all todos.
        await page.getByLabel("Mark all as complete").check();
        // Ensure all todos have 'completed' class.
        await (0, test_1.expect)(page.getByTestId("todo-item")).toHaveClass([
            "completed",
            "completed",
            "completed",
        ]);
        await checkNumberOfCompletedTodosInLocalStorage(page, 3);
    });
});
async function createDefaultTodos(page) {
    // create a new todo locator
    const newTodo = page.getByPlaceholder("What needs to be done?");
    for (const item of TODO_ITEMS) {
        await newTodo.fill(item);
        await newTodo.press("Enter");
    }
}
async function checkNumberOfTodosInLocalStorage(page, expected) {
    return await page.waitForFunction((e) => {
        return JSON.parse(localStorage["react-todos"]).length === e;
    }, expected);
}
async function checkNumberOfCompletedTodosInLocalStorage(page, expected) {
    return await page.waitForFunction((e) => {
        return (JSON.parse(localStorage["react-todos"]).filter((todo) => todo.completed).length === e);
    }, expected);
}
async function checkTodosInLocalStorage(page, title) {
    return await page.waitForFunction((t) => {
        return JSON.parse(localStorage["react-todos"])
            .map((todo) => todo.title)
            .includes(t);
    }, title);
}
