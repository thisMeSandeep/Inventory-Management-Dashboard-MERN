export const getCookieOptions = (maxAge: number) => {
  return {
    httpOnly: true,
    secure: true,
    sameSite: "none" as const,
    maxAge,
  };
};
