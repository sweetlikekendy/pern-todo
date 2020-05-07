// CRUD users routes
// "/users" routes are for getAll, getOne
// "/register" route is for createOne

// import "/users" routes
import usersRoutes from "./users";
// import "/register" route
import register from "./register";
import login from "./login";

export const usersControllers = {
  usersRoutes,
  register: register,
  login,
};
