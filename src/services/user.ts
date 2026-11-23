import {
  STORAGE_KEYS,
  createId,
  fileToDataUrl,
  readStorage,
  removeStorage,
  writeStorage,
} from "./storage";

export interface NewUser {
  name: string;
  login: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  username: string;
  avatarUrl: string;
  bio?: string;
  workoutsCount?: number;
}

export interface LoggedUser {
  token: string;
  user: User;
}

export interface Credentials {
  login: string;
  password: string;
}

export interface UpdateUser {
  name: string;
  username: string;
  bio: string;
  avatar?: File;
}

type StoredUser = User & {
  login: string;
  password: string;
};

type StoredSession = {
  token: string;
  userId: string;
};

const demoUser: StoredUser = {
  id: "user-demo",
  name: "Francyptc",
  username: "Francyptc",
  login: "player@neonsave.gg",
  password: "neon123",
  avatarUrl: "/images/avatar-francyptc.png",
  bio: "Colecionador de mundos, finais secretos e runs perfeitas.",
  workoutsCount: 4,
};

function getUsers(): StoredUser[] {
  const users = readStorage<StoredUser[]>(STORAGE_KEYS.users, []);

  if (users.length > 0) {
    const migratedUsers = users.map((user) => user.id === demoUser.id
      ? {
        ...user,
        name: demoUser.name,
        username: demoUser.username,
        avatarUrl: demoUser.avatarUrl,
      }
      : user);

    if (JSON.stringify(migratedUsers) !== JSON.stringify(users)) {
      writeStorage(STORAGE_KEYS.users, migratedUsers);
    }

    return migratedUsers;
  }

  writeStorage(STORAGE_KEYS.users, [demoUser]);
  return [demoUser];
}

function saveUsers(users: StoredUser[]): void {
  writeStorage(STORAGE_KEYS.users, users);
}

function toPublicUser(user: StoredUser): User {
  const { login, password, ...publicUser } = user;
  void login;
  void password;
  return publicUser;
}

function usernameFrom(name: string, login: string): string {
  const source = name || login.split("@")[0];
  const username = source
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toLowerCase();

  return username || `player_${Date.now()}`;
}

export function getAuthToken(): string | null {
  return readStorage<StoredSession | null>(STORAGE_KEYS.session, null)?.token ?? null;
}

export function getCurrentUser(): User | null {
  const session = readStorage<StoredSession | null>(STORAGE_KEYS.session, null);

  if (!session) {
    return null;
  }

  const user = getUsers().find((storedUser) => storedUser.id === session.userId);
  return user ? toPublicUser(user) : null;
}

export function clearSession(): void {
  removeStorage(STORAGE_KEYS.session);
}

export async function createUser(user: NewUser): Promise<User> {
  const users = getUsers();
  const login = user.login.trim().toLowerCase();

  if (users.some((storedUser) => storedUser.login === login)) {
    throw new Error("Este email já está cadastrado.");
  }

  const username = usernameFrom(user.name.trim(), login);
  const newUser: StoredUser = {
    id: createId("user"),
    name: user.name.trim(),
    username,
    login,
    password: user.password,
    avatarUrl: "",
    bio: "Novo jogador na rede.",
    workoutsCount: 0,
  };

  saveUsers([...users, newUser]);
  return toPublicUser(newUser);
}

export async function signIn(credentials: Credentials): Promise<LoggedUser> {
  const login = credentials.login.trim().toLowerCase();
  const user = getUsers().find(
    (storedUser) => storedUser.login === login && storedUser.password === credentials.password,
  );

  if (!user) {
    throw new Error("Email ou senha inválidos.");
  }

  const session: StoredSession = {
    token: createId("local-session"),
    userId: user.id,
  };
  writeStorage(STORAGE_KEYS.session, session);

  return {
    token: session.token,
    user: toPublicUser(user),
  };
}

export async function fetchLoggedUser(): Promise<User> {
  const user = getCurrentUser();

  if (!getAuthToken() || !user) {
    throw new Error("Usuário não autenticado. Faça login novamente.");
  }

  return user;
}

export async function updateUser(user: UpdateUser): Promise<User> {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    throw new Error("Usuário não autenticado. Faça login novamente.");
  }

  const users = getUsers();
  const storedUser = users.find((candidate) => candidate.id === currentUser.id);

  if (!storedUser) {
    throw new Error("Perfil não encontrado.");
  }

  const duplicateUsername = users.some(
    (candidate) => candidate.id !== storedUser.id && candidate.username === user.username,
  );

  if (duplicateUsername) {
    throw new Error("Este handle já está em uso.");
  }

  const avatarUrl = user.avatar ? await fileToDataUrl(user.avatar) : storedUser.avatarUrl;
  const updatedUser: StoredUser = {
    ...storedUser,
    name: user.name,
    username: user.username,
    bio: user.bio,
    avatarUrl,
  };

  saveUsers(users.map((candidate) => candidate.id === updatedUser.id ? updatedUser : candidate));
  return toPublicUser(updatedUser);
}

export function incrementWorkoutsCount(userId: string): void {
  const users = getUsers();
  saveUsers(users.map((user) => user.id === userId
    ? { ...user, workoutsCount: (user.workoutsCount ?? 0) + 1 }
    : user));
}
