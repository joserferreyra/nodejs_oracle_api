//const entity = require('./entitymap');

function getSQLselect(entity) {
    let sqlCab = 'SELECT ';
    let first = true;
    for (const key in entity.fields) {
        if (first) {
            first = false;
        } else {
            sqlCab += ', ';
        }
        sqlCab += entity.fields[key] + ' as ' + key;
    }
    entity.sql["fromClause"].forEach(line => {
        sqlCab += '\n' + line + ' '
    });

    return sqlCab;
}

function getWhereFields(context, fields) {
    const binds = {};
    const outbinds = {};
    let query = '';

    let firstWhere = true;

    for (const key in context) {
        if (key != 'limit' & key != 'offset' & key != 'sort' & key != 'search' & key != 'greatereq' & key != 'lesseq') {
            if (firstWhere) {
                if (fields[key]) {
                    if (context[key] == 'null') {
                        query += `\nwhere ` + fields[key] + ` is null `; // entity.fields[key];
                    } else {
                        query += `\nwhere ` + fields[key] + `= :` + key; // entity.fields[key];
                        binds[key] = context[key];
                    }
                } else {
                    outbinds[key] = context[key];
                }
                firstWhere = false;
            } else {
                if (fields[key]) {
                    if (context[key] == 'null') {
                        query += `\nand ` + fields[key] + ` is null `; // entity.fields[key];
                    } else {
                        query += `\nand ` + fields[key] + `= :` + key; // entity.fields[key];
                        binds[key] = context[key];
                    }
                } else {
                    outbinds[key] = context[key];
                }
            }
        } else {
            if (key != 'sort' & key != 'search' & key != 'greatereq' & key != 'lesseq') {
                binds[key] = context[key];
            }
        }
    }

    if (context.search !== undefined) {
        let [key, text] = context.search.split(':');

        if (firstWhere) {
            query += ` \nwhere lower(${fields[key]}) like '%${text.toLowerCase()}%' `;
        } else {
            query += `\nand lower(${fields[key]}) like '%${text.toLowerCase()}%' `;
        }
    }

    if (context.greatereq !== undefined) {
        let [key, value] = context.greatereq.split(':');

        if (firstWhere) {
            query += ` \nwhere ${fields[key]} >= TO_DATE('${value}','dd/mm/yyyy') `;
        } else {
            query += `\nand ${fields[key]} >= TO_DATE('${value}','dd/mm/yyyy') `;
        }
    }

    if (context.lesseq !== undefined) {
        let [key, value] = context.lesseq.split(':');

        if (firstWhere) {
            query += ` \nwhere ${fields[key]} <= TO_DATE('${value}','dd/mm/yyyy') `;
        } else {
            query += `\nand ${fields[key]} <= TO_DATE('${value}','dd/mm/yyyy') `;
        }
    }

    if (context.sort !== undefined) {
        let jsonSort = JSON.parse(context.sort)
        let orderStr = '';
        let first = true
        for (const key in jsonSort) {
            if (!first) {
                orderStr += ', ';
            } else {
                first = false;
            }
            orderStr += key + ' ' + jsonSort[key];
        }
        query += `\norder by ${orderStr}`;
    }

    return { 'where': query, 'binds': binds, 'outbinds': outbinds };

}

function getSQL(context, entity) {

    const query = getSQLselect(entity);

    const queryWhere = entity.sql.whereFields ? getWhereFields(context, entity.whereFields) : getWhereFields(context, entity.fields);

    let sqlGroup = '';

    if (entity.sql["groupClause"]) {
        entity.sql["groupClause"].forEach(line => {
            sqlGroup += '\n' + line + ' '
        });
    }

    const fullQuery = query + queryWhere.where + sqlGroup;

    return { 'sql': fullQuery, 'binds': queryWhere.binds, 'outbinds': queryWhere.outbinds};

}

module.exports.getSQLEntity = getSQL;