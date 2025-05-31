using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class CopiesController : ControllerBase
{
    private readonly LibraryContext _context;
    public CopiesController(LibraryContext context) => _context = context;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CopyDto>>> GetCopies()
    {
        var copies = await _context.Copies
            .Include(c => c.Book)
            .Select(c => new CopyDto(c.Id, c.BookId, c.Book.Title))
            .ToListAsync();
        return Ok(copies);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<CopyDto>> GetCopy(int id)
    {
        var copy = await _context.Copies.Include(c => c.Book).FirstOrDefaultAsync(c => c.Id == id);
        if (copy == null) return NotFound();
        
        var copyDto = new CopyDto(copy.Id, copy.BookId, copy.Book.Title);
        return Ok(copyDto);
    }

    [HttpPost]
    public async Task<ActionResult<CopyDto>> CreateCopy(CreateCopyDto dto)
    {
        var book = await _context.Books.FindAsync(dto.BookId);
        if (book == null) return BadRequest("Book not found");
        
        var copy = new Copy { BookId = dto.BookId };
        _context.Copies.Add(copy);
        await _context.SaveChangesAsync();
        
        copy = await _context.Copies.Include(c => c.Book).FirstAsync(c => c.Id == copy.Id);
        var copyDto = new CopyDto(copy.Id, copy.BookId, copy.Book.Title);
        return CreatedAtAction(nameof(GetCopy), new { id = copy.Id }, copyDto);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCopy(int id)
    {
        var copy = await _context.Copies.FindAsync(id);
        if (copy == null) return NotFound();
        
        _context.Copies.Remove(copy);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}