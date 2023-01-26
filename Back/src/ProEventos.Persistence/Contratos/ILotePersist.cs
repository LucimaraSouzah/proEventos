using ProEventos.Domain;

namespace ProEventos.Persistence.Contratos
{
    public interface ILotePersist
    {
        Task<Lote[]> GetLotesByEventoIdAsync (int eventoId);
        Task<Lote> GetLoteByIdsAsync(int eventoId, int loteId);
    }
}