export const getCookieOptions = (maxAge: number) => ({
  httpOnly: true,
  secure: true,
  sameSite: "none" as const,
  maxAge,
});

