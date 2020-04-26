// CRUD users routes
// "/users" routes are for getAll, getOne
// "/register" route is for createOne

// import "/users" routes
import usersRoutes from "./users";
// import "/register" route
import additionalUsersRoutes from "./additionalUserRoutes";

export const usersControllers = {
  usersRoutes,
  createOneUser: additionalUsersRoutes,
};
