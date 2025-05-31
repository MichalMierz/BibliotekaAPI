public record AuthorDto(int Id, string FirstName, string LastName);
public record CreateAuthorDto(string FirstName, string LastName);
public record UpdateAuthorDto(string FirstName, string LastName);