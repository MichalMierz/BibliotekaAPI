using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class AuthorsController : ControllerBase
{
    private readonly LibraryContext _context;
    public AuthorsController(LibraryContext context) => _context = context;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<AuthorDto>>> GetAuthors()
    {
        var authors = await _context.Authors
            .Select(a => new AuthorDto(a.Id, a.FirstName, a.LastName))
            .ToListAsync();
        return Ok(authors);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<AuthorDto>> GetAuthor(int id)
    {
        var author = await _context.Authors.FindAsync(id);
        if (author == null) return NotFound();
        
        var authorDto = new AuthorDto(author.Id, author.FirstName, author.LastName);
        return Ok(authorDto);
    }

    [HttpPost]
    public async Task<ActionResult<AuthorDto>> CreateAuthor(CreateAuthorDto dto)
    {
        var author = new Author { FirstName = dto.FirstName, LastName = dto.LastName };
        _context.Authors.Add(author);
        await _context.SaveChangesAsync();
        
        var authorDto = new AuthorDto(author.Id, author.FirstName, author.LastName);
        return CreatedAtAction(nameof(GetAuthor), new { id = author.Id }, authorDto);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<AuthorDto>> UpdateAuthor(int id, UpdateAuthorDto dto)
    {
        var author = await _context.Authors.FindAsync(id);
        if (author == null) return NotFound();
        
        author.FirstName = dto.FirstName;
        author.LastName = dto.LastName;
        await _context.SaveChangesAsync();
        
        var authorDto = new AuthorDto(author.Id, author.FirstName, author.LastName);
        return Ok(authorDto);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAuthor(int id)
    {
        var author = await _context.Authors.FindAsync(id);
        if (author == null) return NotFound();
        
        _context.Authors.Remove(author);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}