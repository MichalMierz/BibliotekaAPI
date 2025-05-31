public record BookDto(int Id, string Title, int Year, string AuthorName);
public record CreateBookDto(string Title, int Year, int AuthorId);
public record UpdateBookDto(string Title, int Year, int AuthorId);