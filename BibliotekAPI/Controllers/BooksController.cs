using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class BooksController : ControllerBase
{
    private readonly LibraryContext _context;
    public BooksController(LibraryContext context) => _context = context;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<BookDto>>> GetBooks([FromQuery] int? authorId)
    {
        var query = _context.Books.Include(b => b.Author).AsQueryable();
        if (authorId.HasValue)
            query = query.Where(b => b.AuthorId == authorId);
        var books = await query.Select(b => new BookDto(b.Id, b.Title, b.Year, $"{b.Author.FirstName} {b.Author.LastName}")).ToListAsync();
        return Ok(books);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<BookDto>> GetBook(int id)
    {
        var book = await _context.Books.Include(b => b.Author).FirstOrDefaultAsync(b => b.Id == id);
        if (book == null) return NotFound();
        
        var bookDto = new BookDto(book.Id, book.Title, book.Year, $"{book.Author.FirstName} {book.Author.LastName}");
        return Ok(bookDto);
    }

    [HttpPost]
    public async Task<ActionResult<BookDto>> CreateBook(CreateBookDto dto)
    {
        var author = await _context.Authors.FindAsync(dto.AuthorId);
        if (author == null) return BadRequest("Author not found");
        
        var book = new Book { Title = dto.Title, Year = dto.Year, AuthorId = dto.AuthorId };
        _context.Books.Add(book);
        await _context.SaveChangesAsync();
        
        book = await _context.Books.Include(b => b.Author).FirstAsync(b => b.Id == book.Id);
        var bookDto = new BookDto(book.Id, book.Title, book.Year, $"{book.Author.FirstName} {book.Author.LastName}");
        return CreatedAtAction(nameof(GetBook), new { id = book.Id }, bookDto);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<BookDto>> UpdateBook(int id, UpdateBookDto dto)
    {
        var book = await _context.Books.FindAsync(id);
        if (book == null) return NotFound();
        
        var author = await _context.Authors.FindAsync(dto.AuthorId);
        if (author == null) return BadRequest("Author not found");
        
        book.Title = dto.Title;
        book.Year = dto.Year;
        book.AuthorId = dto.AuthorId;
        await _context.SaveChangesAsync();
        
        book = await _context.Books.Include(b => b.Author).FirstAsync(b => b.Id == book.Id);
        var bookDto = new BookDto(book.Id, book.Title, book.Year, $"{book.Author.FirstName} {book.Author.LastName}");
        return Ok(bookDto);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBook(int id)
    {
        var book = await _context.Books.FindAsync(id);
        if (book == null) return NotFound();
        
        _context.Books.Remove(book);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}