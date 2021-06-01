module.exports = {
    archivoIPSST: {
        fields: {
            Periodo: "ipsst_cab.PERIODO",
            TipoLiquidacionId: "ipsst_cab.IdTipoLiq",
            GrupoAdicionalId: "ipsst_cab.IdGrupoAdi",
            NombreArchivo: "ipsst_cab.NOMBRE",
            Cadena: "ipsst_det.CADENA",
            IdLiq: "ipsst_det.idliq"
        },
        key: {},
        sql: {
            fromClause: [
                "FROM ipsst_cab",
                "INNER JOIN ipsst_det ON ipsst_det.idcab = ipsst_cab.idcab"
            ]
        }
    },
    acredDet: {
        fields: {
            Orden: 'C.ORDEN',
            Documento: 'P.DNI',
            Apellido: "(P.APELLIDO||' '|| P.NOMBRE)",
            Neto: 'ABD.NETO',
            Cuota1: 'ABD.CUOTA1',
            ValorFijo: 'ABD.VALFIJO',
            Cuenta: 'ABD.CUENTA'
        },
        key: {},
        sql: {
            fromClause: [
                "from US_SUELDO.ACRED_BCO_CAB ABC",
                "INNER JOIN US_SUELDO.ACRED_BCO_DET ABD ON ABD.IDACREDCAB = ABC.IDACREDCAB",
                "INNER JOIN US_SUELDO.PERSONAS P ON P.IDPERS = ABD.IDPERS",
                "INNER JOIN US_SUELDO.LIQ L ON L.IDLIQ = ABD.IDLIQ",
                "INNER JOIN US_SUELDO.CARGOS C ON C.IDCARGO = L.IDCARGO"
            ],
            whereFields: {
                Periodo: 'ABC.PERIODO',
                TipoLiquidacionId: 'ABC.IDTIPOLIQ',
                GrupoAdicionalId: 'ABC.IDGRUPOADI'
            },
            orderBy: 'ORDER BY C.ORDEN'
        }
    }
}
