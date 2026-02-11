// server.js

import express from "express";
import cors from "cors";
import pkg from "pg";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { FileService } from "./services/fileService.js";

// Configurar dotenv
dotenv.config();

// Extraer Pool del paquete pg
const { Pool } = pkg;

// Necesario para usar __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Configuración PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "ultragen",
  password: process.env.DB_PASS || "bendixon00",
  port: process.env.DB_PORT || 5432,
});

// ====================== DIARIOS ======================

// Obtener todos
app.get("/api/diarios", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM diarios ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear
app.post("/api/diarios", async (req, res) => {
  const { nombre, sinopsis } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO diarios (nombre, sinopsis) VALUES ($1, $2) RETURNING *",
      [nombre, sinopsis]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Actualizar
// PUT /api/diarios/:id → actualiza cualquier campo parcial
app.put("/api/diarios/:id", async (req, res) => {
  const { nombre, sinopsis, ruta_img } = req.body;

  try {
    // Obtener el diario actual
    const current = await pool.query(
      "SELECT * FROM diarios WHERE id=$1",
      [req.params.id]
    );

    if (current.rows.length === 0) {
      return res.status(404).json({ error: "Diario no encontrado" });
    }

    const updatedNombre = nombre !== undefined ? nombre : current.rows[0].nombre;
    const updatedSinopsis = sinopsis !== undefined ? sinopsis : current.rows[0].sinopsis;
    const updatedRutaImg = ruta_img !== undefined ? ruta_img : current.rows[0].ruta_img;

    const result = await pool.query(
      "UPDATE diarios SET nombre=$1, sinopsis=$2, ruta_img=$3 WHERE id=$4 RETURNING *",
      [updatedNombre, updatedSinopsis, updatedRutaImg, req.params.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.put("/api/diarios/:id/ruta", async (req, res) => {
  const { ruta_img } = req.body;

  try {
    const result = await pool.query(
      "UPDATE diarios SET ruta_img=$1 WHERE id=$2 RETURNING *",
      [ruta_img, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Diario no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Eliminar
app.delete("/api/diarios/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM diarios WHERE id=$1", [req.params.id]);
    res.json({ message: "Diario eliminado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ====================== TOMOS ======================

app.get("/api/tomos/:diarioId", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM tomos WHERE diario_id=$1 ORDER BY id",
      [req.params.diarioId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/tomos", async (req, res) => {
  const { nombre, sinopsis, diario_id } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO tomos (nombre, sinopsis, diario_id) VALUES ($1, $2, $3) RETURNING *",
      [nombre, sinopsis, diario_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/tomos/:id → actualiza cualquier campo parcial
app.put("/api/tomos/:id", async (req, res) => {
  const { nombre, sinopsis, ruta_img } = req.body;

  try {
    // Obtener el tomo actual
    const current = await pool.query(
      "SELECT * FROM tomos WHERE id=$1",
      [req.params.id]
    );

    if (current.rows.length === 0) {
      return res.status(404).json({ error: "Tomo no encontrado" });
    }

    const updatedNombre = nombre !== undefined ? nombre : current.rows[0].nombre;
    const updatedSinopsis = sinopsis !== undefined ? sinopsis : current.rows[0].sinopsis;
    const updatedRutaImg = ruta_img !== undefined ? ruta_img : current.rows[0].ruta_img;

    const result = await pool.query(
      "UPDATE tomos SET nombre=$1, sinopsis=$2, ruta_img=$3 WHERE id=$4 RETURNING *",
      [updatedNombre, updatedSinopsis, updatedRutaImg, req.params.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/tomos/:id/ruta", async (req, res) => {
  const { ruta_img } = req.body;

  try {
    const result = await pool.query(
      "UPDATE tomos SET ruta_img=$1 WHERE id=$2 RETURNING *",
      [ruta_img, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Tomo no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/tomos/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM tomos WHERE id=$1", [req.params.id]);
    res.json({ message: "Tomo eliminado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ====================== CAPÍTULOS ======================

app.get("/api/capitulos", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM capitulos ORDER BY orden",
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/capitulos/:tomoId", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM capitulos WHERE tomo_id=$1 ORDER BY id",
      [req.params.tomoId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/capitulos", async (req, res) => {
  const { nombre, sinopsis, tomo_id } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO capitulos (nombre, sinopsis, tomo_id) VALUES ($1, $2, $3) RETURNING *",
      [nombre, sinopsis, tomo_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/capitulos/:id", async (req, res) => {
  const { nombre, sinopsis, pais, ciudad, anio } = req.body;

  try {
    // Obtener el capítulo actual
    const current = await pool.query(
      "SELECT * FROM capitulos WHERE id=$1",
      [req.params.id]
    );

    if (current.rows.length === 0) {
      return res.status(404).json({ error: "Capítulo no encontrado" });
    }

    const updatedNombre = nombre !== undefined ? nombre : current.rows[0].nombre;
    const updatedSinopsis = sinopsis !== undefined ? sinopsis : current.rows[0].sinopsis;
    const updatedPais = pais !== undefined ? pais : current.rows[0].pais;
    const updatedCiudad = ciudad !== undefined ? ciudad : current.rows[0].ciudad;
    const updatedAnnio = anio !== undefined ? anio : current.rows[0].anio;

    const result = await pool.query(
      `UPDATE capitulos 
       SET nombre=$1, sinopsis=$2, pais=$3, ciudad=$4, anio=$5 
       WHERE id=$6 
       RETURNING *`,
      [updatedNombre, updatedSinopsis, updatedPais, updatedCiudad, updatedAnnio, req.params.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/capitulos/:id/ruta", async (req, res) => {
  const { ruta_img } = req.body;

  try {
    const result = await pool.query(
      `UPDATE capitulos 
       SET ruta_img=$1
       WHERE id=$2
       RETURNING *`,
      [ruta_img, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Capítulo no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.delete("/api/capitulos/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM capitulos WHERE id=$1", [req.params.id]);
    res.json({ message: "Capítulo eliminado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ====================== CONTENIDO DE CAPÍTULOS ======================

// Obtener el contenido de un capítulo
app.get("/api/capitulos/contenido/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM capitulos WHERE id=$1",
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Capítulo no encontrado" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear o actualizar contenido de un capítulo (upsert)
app.put("/api/capitulos/contenido/:id", async (req, res) => {
  const { contenido } = req.body;
  try {
    const result = await pool.query(
      "UPDATE capitulos SET contenido=$1 WHERE id=$2 RETURNING id, nombre, contenido",
      [contenido, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Capítulo no encontrado" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Actualizar el orden de un capítulo
app.put("/api/capitulos/orden/:id", async (req, res) => {
  const { orden } = req.body; // el nuevo valor de orden
  try {
    const result = await pool.query(
      "UPDATE capitulos SET orden=$1 WHERE id=$2 RETURNING id, nombre, orden",
      [orden, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Capítulo no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Acción explícita
app.post("/api/capitulos/aplicar-orden", async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE capitulos c
       SET orden = t.orden_final
       FROM capitulos_orden_temp t
       WHERE c.id = t.id
       RETURNING c.id, c.nombre, c.orden`
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No se actualizaron capítulos" });
    }

    res.json({
      message: "Orden global aplicado correctamente",
      capitulos_actualizados: result.rows,
    });
  } catch (err) {
    console.error("Error al aplicar orden global:", err);
    res.status(500).json({ error: err.message });
  }
});


// (Opcional) Borrar contenido de un capítulo
app.delete("/api/capitulos/contenido/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "UPDATE capitulos SET contenido=NULL WHERE id=$1 RETURNING id",
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Capítulo no encontrado" });
    res.json({ message: "Contenido eliminado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener solo las etiquetas de un capítulo
app.get("/api/capitulos/:id/etiquetas", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT romance, risas, lagrimas, violencia, peligro, armas, sexo, eventos
       FROM capitulos
       WHERE id=$1`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Capítulo no encontrado" });
    }

    res.json(result.rows[0]); // Devuelve solo las etiquetas
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Actualizar etiquetas de un capítulo
app.put("/api/capitulos/:id/etiquetas", async (req, res) => {
  const { romance, risas, lagrimas, violencia, peligro, armas, sexo, eventos } = req.body;

  try {
    const result = await pool.query(
      `UPDATE capitulos SET
        romance=$1, risas=$2, lagrimas=$3, violencia=$4,
        peligro=$5, armas=$6, sexo=$7, eventos=$8
       WHERE id=$9 RETURNING 
        id, romance, risas, lagrimas, violencia, peligro, armas, sexo, eventos`,
      [romance, risas, lagrimas, violencia, peligro, armas, sexo, eventos, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Capítulo no encontrado" });
    }

    res.json(result.rows[0]); // Devuelve el capítulo con las etiquetas actualizadas
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ====================== IMAGENES ======================

const upload = multer({ storage: multer.memoryStorage() });
app.post("/api/capitulos/:capituloId/imagenes", upload.single("imagen"), async (req, res) => {
  try {
    const { capituloId } = req.params;
    const { tag, relativePath } = req.body;

    if (!relativePath) return res.status(400).json({ error: "No se recibió relativePath" });
    if (!tag) return res.status(400).json({ error: "No se recibió tag" });

    // Guardar imagen en disco
    const savedPath = await FileService.saveImage(relativePath, req.file);

    // Extraer tomoId desde la ruta relativa si lo necesitas (ej: images_dinamica/capitulos/<tomoId>/<capituloId>)
    const match = relativePath.match(/capitulos\/([^/]+)\/([^/]+)/);
    const tomoId = match ? match[1] : null;

    // Insertar registro en la BD
    const result = await pool.query(
      `INSERT INTO capitulos_imagenes (tomo_id, capitulo_id, ruta, tag)
       VALUES ($1, $2, $3, $4)
       RETURNING id, tomo_id, capitulo_id, ruta, tag`,
      [tomoId, capituloId, savedPath, tag]
    );

    res.json({
      ok: true,
      ...result.rows[0],
    });
  } catch (err) {
    console.error("❌ Error al guardar imagen:", err);
    res.status(500).json({ error: "Error al guardar imagen", detalles: err.message });
  }
});

// Obtener imágenes
app.get("/api/capitulos/:tomoId/:capituloId/imagenes", async (req, res) => {
  const { capituloId } = req.params;
  try {
    const result = await pool.query(
      "SELECT id, ruta, tag FROM capitulos_imagenes WHERE capitulo_id = $1",
      [capituloId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener imágenes", detalles: err.message });
  }
});

// Eliminar imagen
app.delete("/api/capitulos/:capituloId/imagenes/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM capitulos_imagenes WHERE id = $1", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al eliminar imagen", detalles: err.message });
  }
});
// ====================== Portadas Diario ==================
app.post("/api/diarios/portada", upload.single("imagen"), async (req, res) => {
  try {
    const { tag, relativePath } = req.body;
    if (!relativePath) return res.status(400).json({ error: "No se recibió relativePath" });
    if (!tag) return res.status(400).json({ error: "No se recibió tag" });

    const savedPath = await FileService.saveImage(relativePath, req.file);

    res.json({ ruta: savedPath, tag });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al guardar portada", detalles: err.message });
  }
});
// ====================== Portadas Tomo ====================

app.post("/api/tomos/portada", upload.single("imagen"), async (req, res) => {
  try {
    const { tag, relativePath } = req.body;
    if (!relativePath) return res.status(400).json({ error: "No se recibió relativePath" });
    if (!tag) return res.status(400).json({ error: "No se recibió tag" });

    const savedPath = await FileService.saveImage(relativePath, req.file);

    res.json({ ruta: savedPath, tag });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al guardar portada", detalles: err.message });
  }
});

//======================= Portadas Capitulo ===========
app.post("/api/capitulos/portada", upload.single("imagen"), async (req, res) => {
  try {
    const { tag, relativePath } = req.body;
    if (!relativePath) return res.status(400).json({ error: "No se recibió relativePath" });
    if (!tag) return res.status(400).json({ error: "No se recibió tag" });

    const savedPath = await FileService.saveImage(relativePath, req.file);

    res.json({ ruta: savedPath, tag });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al guardar portada", detalles: err.message });
  }
});

// ====================== Slaps =======================
app.post("/api/capitulos/:capituloId/slaps/upload", upload.single("imagen"), async (req, res) => {
  try {
    const { relativePath, tag } = req.body;
    if (!relativePath) return res.status(400).json({ error: "Falta relativePath" });
    if (!req.file) return res.status(400).json({ error: "Falta archivo" });

    const savedPath = await FileService.saveImage(relativePath, req.file);
    res.json({ ruta: savedPath, tag });
  } catch (err) {
    console.error("Error al guardar slap:", err);
    res.status(500).json({ error: "Error al guardar slap", detalles: err.message });
  }
});

// ====================== Personajes ==================
app.post("/api/personajes/upload", upload.single("imagen"), async (req, res) => {
  try {
    const { relativePath, tag } = req.body;
    if (!relativePath) return res.status(400).json({ error: "Falta relativePath" });
    if (!req.file) return res.status(400).json({ error: "Falta archivo" });

    const savedPath = await FileService.saveImage(relativePath, req.file);
    res.json({ ruta: savedPath, tag });
  } catch (err) {
    console.error("Error al guardar imagen de personaje:", err);
    res.status(500).json({ error: "Error al guardar imagen", detalles: err.message });
  }
});

// ====================== Mensajes ====================
app.post("/api/mensajes/:id_conversacion/imagen", upload.single("imagen"), async (req, res) => {
  try {
    const { relativePath } = req.body;
    const { id_conversacion } = req.params;

    if (!relativePath) return res.status(400).json({ error: "No se recibió relativePath" });
    if (!req.file) return res.status(400).json({ error: "No se recibió archivo" });

    const savedPath = await FileService.saveImage(relativePath, req.file);

    res.json({ ruta: savedPath });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al guardar imagen", detalles: err.message });
  }
});
// ====================== PISTAS ======================

// Crear pista
app.post("/api/capitulos/:capituloId/pistas", async (req, res) => {
  try {
    const { capituloId } = req.params;
    const { titulo, contenido, orden } = req.body;
    const tomoId = req.query.tomoId;

    if (!tomoId) return res.status(400).json({ error: "No se recibió tomoId" });
    if (!contenido) return res.status(400).json({ error: "El contenido es obligatorio" });

    const result = await pool.query(
      `INSERT INTO capitulos_pistas (tomo_id, capitulo_id, titulo, contenido, orden) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, titulo, contenido, orden, tomo_id, capitulo_id`,
      [tomoId, capituloId, titulo || null, contenido, orden || null]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al guardar pista", detalles: err.message });
  }
});

// Obtener todas las pistas de un capítulo
app.get("/api/capitulos/:tomoId/:capituloId/pistas", async (req, res) => {
  const { capituloId } = req.params;
  try {
    const result = await pool.query(
      "SELECT id, titulo, contenido, orden FROM capitulos_pistas WHERE capitulo_id = $1 ORDER BY orden NULLS LAST, id",
      [capituloId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener pistas", detalles: err.message });
  }
});

// Actualizar pista
app.put("/api/capitulos/:capituloId/pistas/:id", async (req, res) => {
  try {
    const { capituloId, id } = req.params;
    const { titulo, contenido, orden } = req.body;

    const result = await pool.query(
      `UPDATE capitulos_pistas 
       SET titulo = $1, contenido = $2, orden = $3 
       WHERE id = $4 AND capitulo_id = $5 
       RETURNING id, titulo, contenido, orden`,
      [titulo || null, contenido, orden || null, id, capituloId]
    );

    if (result.rows.length === 0) return res.status(404).json({ error: "Pista no encontrada" });

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al actualizar pista", detalles: err.message });
  }
});

// Eliminar pista
app.delete("/api/capitulos/:capituloId/pistas/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM capitulos_pistas WHERE id = $1", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al eliminar pista", detalles: err.message });
  }
});
// ====================== SLAPS ======================
// Crear slap
app.post("/api/capitulos/:capituloId/slaps", async (req, res) => {
  try {
    const { capituloId } = req.params;
    const { ruta, nivel } = req.body;
    const tomoId = req.query.tomoId;

    if (!tomoId) return res.status(400).json({ error: "No se recibió tomoId" });
    if (!ruta) return res.status(400).json({ error: "La ruta es obligatoria" });

    const result = await pool.query(
      `INSERT INTO capitulos_slaps (tomo_id, capitulo_id, ruta, nivel) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, tomo_id, capitulo_id, ruta, nivel, created_at`,
      [tomoId, capituloId, ruta, nivel || 0]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al guardar slap", detalles: err.message });
  }
});

// Obtener todos los slaps de un capítulo
app.get("/api/capitulos/:tomoId/:capituloId/slaps", async (req, res) => {
  const { capituloId } = req.params;
  try {
    const result = await pool.query(
      "SELECT id, ruta, nivel, created_at FROM capitulos_slaps WHERE capitulo_id = $1 ORDER BY nivel NULLS LAST, id",
      [capituloId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener slaps", detalles: err.message });
  }
});

// Actualizar slap
app.put("/api/capitulos/:capituloId/slaps/:id", async (req, res) => {
  try {
    const { capituloId, id } = req.params;
    const { ruta, nivel } = req.body;

    const result = await pool.query(
      `UPDATE capitulos_slaps 
       SET ruta = $1, nivel = $2 
       WHERE id = $3 AND capitulo_id = $4 
       RETURNING id, ruta, nivel, created_at`,
      [ruta || null, nivel || 0, id, capituloId]
    );

    if (result.rows.length === 0) return res.status(404).json({ error: "Slap no encontrado" });

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al actualizar slap", detalles: err.message });
  }
});

// Eliminar slap
app.delete("/api/capitulos/:capituloId/slaps/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM capitulos_slaps WHERE id = $1", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al eliminar slap", detalles: err.message });
  }
});

// ====================== PERSONAJES ======================
// Obtener todos los personajes
app.get("/api/personajes", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM personajes ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener personajes de un diario
app.get("/api/diarios/:diario_id/personajes", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM personajes WHERE diario_id=$1 ORDER BY prioridad, id",
      [req.params.diario_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear personaje
app.post("/api/personajes", async (req, res) => {
  const { diario_id, tomo_id, capitulo_id, nombre, descripcion, ruta_img, prioridad } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO personajes (diario_id, tomo_id, capitulo_id, nombre, descripcion, ruta_img, prioridad) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [diario_id, tomo_id, capitulo_id, nombre, descripcion, ruta_img, prioridad ?? 0]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Actualizar personaje (PUT parcial)
app.put("/api/personajes/:id", async (req, res) => {
  const { diario_id, tomo_id, capitulo_id, nombre, descripcion, ruta_img, prioridad } = req.body;

  try {
    const current = await pool.query("SELECT * FROM personajes WHERE id=$1", [req.params.id]);

    if (current.rows.length === 0) {
      return res.status(404).json({ error: "Personaje no encontrado" });
    }

    const updatedDiarioId = diario_id !== undefined ? diario_id : current.rows[0].diario_id;
    const updatedTomoId = tomo_id !== undefined ? tomo_id : current.rows[0].tomo_id;
    const updatedCapituloId = capitulo_id !== undefined ? capitulo_id : current.rows[0].capitulo_id;
    const updatedNombre = nombre !== undefined ? nombre : current.rows[0].nombre;
    const updatedDescripcion = descripcion !== undefined ? descripcion : current.rows[0].descripcion;
    const updatedRutaImg = ruta_img !== undefined ? ruta_img : current.rows[0].ruta_img;
    const updatedPrioridad = prioridad !== undefined ? prioridad : current.rows[0].prioridad;

    const result = await pool.query(
      `UPDATE personajes 
       SET diario_id=$1, tomo_id=$2, capitulo_id=$3, nombre=$4, descripcion=$5, ruta_img=$6, prioridad=$7
       WHERE id=$8 RETURNING *`,
      [updatedDiarioId, updatedTomoId, updatedCapituloId, updatedNombre, updatedDescripcion, updatedRutaImg, updatedPrioridad, req.params.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar personaje
app.delete("/api/personajes/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM personajes WHERE id=$1", [req.params.id]);
    res.json({ message: "Personaje eliminado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ====================== CONVERSACIONES ======================
app.post("/api/conversaciones", async (req, res) => {
  const { personajes } = req.body; // [id1, id2]

  if (!Array.isArray(personajes) || personajes.length !== 2) {
    return res.status(400).json({ error: "Se deben enviar exactamente 2 personajes" });
  }

  try {
    // Crear conversación vacía y obtener su ID
    const convResult = await pool.query(`
      INSERT INTO conversaciones DEFAULT VALUES RETURNING conversacion_id
    `);
    const conversacion_id = convResult.rows[0].conversacion_id;

    // Relacionar los dos personajes con la conversación recién creada
    for (const personaje_id of personajes) {
      await pool.query(
        `INSERT INTO personajes_conversacion (conversacion_id, personaje_id)
         VALUES ($1, $2)`,
        [conversacion_id, personaje_id]
      );
    }

    res.json({ conversacion_id, personajes });
  } catch (err) {
    console.error("Error al crear conversación:", err);
    res.status(500).json({ error: err.message });
  }
});


// 📘 Obtener todas las conversaciones (con 2 personajes)
app.get("/api/conversaciones", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        c.conversacion_id,
        p1.id AS personaje1_id,
        p1.nombre AS personaje1,
        p2.id AS personaje2_id,
        p2.nombre AS personaje2
      FROM conversaciones c
      JOIN personajes_conversacion pc1 
        ON c.conversacion_id = pc1.conversacion_id
      JOIN personajes_conversacion pc2 
        ON c.conversacion_id = pc2.conversacion_id
       AND pc1.personaje_id < pc2.personaje_id
      JOIN personajes p1 
        ON pc1.personaje_id = p1.id
      JOIN personajes p2 
        ON pc2.personaje_id = p2.id
      ORDER BY c.conversacion_id DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener conversaciones:", err);
    res.status(500).json({ error: err.message });
  }
});

// 🗑️ Eliminar conversación
app.delete("/api/conversaciones/:id", async (req, res) => {
  const conversacion_id = req.params.id;

  try {
    // Primero eliminar los vínculos (solo si tu FK no tiene ON DELETE CASCADE)
    await pool.query(
      "DELETE FROM personajes_conversacion WHERE conversacion_id = $1",
      [conversacion_id]
    );

    // Luego eliminar la conversación
    await pool.query(
      "DELETE FROM conversaciones WHERE conversacion_id = $1",
      [conversacion_id]
    );

    res.json({ message: "Conversación eliminada correctamente" });
  } catch (err) {
    console.error("Error al eliminar conversación:", err);
    res.status(500).json({ error: err.message });
  }
});



// Obtener mensajes de una conversación
app.get("/api/conversaciones/:id/mensajes", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT m.*, p.nombre 
       FROM mensajes m
       JOIN personajes p ON m.personaje_id = p.id
       WHERE conversacion_id=$1
       ORDER BY fecha`,
      [req.params.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear mensaje dentro de una conversación(NO ESTOY SEGURO DE QUE ESTÉ EN USO)
app.post("/api/conversaciones/:id/mensajes", async (req, res) => {
  const { personaje_id, mensaje, fecha } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO mensajes (conversacion_id, personaje_id, mensaje, fecha)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [req.params.id, personaje_id, mensaje, fecha]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ====================
// Mensajes
// ====================
// GET /api/mensajes → lista mensajes con nombre del personaje
app.get("/api/mensajes", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        m.id,
        m.mensaje,
        m.ruta_img,
        m.conversacion_id,
        p.nombre AS personaje,
        m.fecha_simulada,
        m.hora_simulada,
        m.orden
      FROM mensajes m
      LEFT JOIN personajes p ON m.personaje_id = p.id
      ORDER BY m.id ASC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/conversaciones/:id/mensajes-simulados
app.post("/api/conversaciones/:id/mensajes-simulados", async (req, res) => {
  const { personaje_id, mensaje, fecha, fecha_simulada, hora_simulada, orden } = req.body;
  const conversacion_id = req.params.id;

  // Mostrar los datos recibidos
  console.log("POST /mensajes-simulados - Datos recibidos:", {
    conversacion_id,
    personaje_id,
    mensaje,
    fecha,
    fecha_simulada,
    hora_simulada,
    orden,
  });

  // Validaciones
  if (!personaje_id)
    return res.status(400).json({ error: "Debe seleccionar un personaje" });
  if (orden === undefined || orden === null)
    return res.status(400).json({ error: "Debe enviar el orden del mensaje" });

  try {
    const result = await pool.query(
      `INSERT INTO mensajes (conversacion_id, personaje_id, mensaje, fecha, fecha_simulada, hora_simulada, orden)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        conversacion_id,
        personaje_id,
        mensaje || "",
        fecha || new Date().toISOString(),
        fecha_simulada || null,
        hora_simulada || null,
        orden,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error al insertar mensaje simulado:", err.message);
    res.status(500).json({ error: "Error al crear mensaje simulado" });
  }
});

app.put("/api/mensajes/:id/ruta", async (req, res) => {
  const { ruta_img } = req.body;

  try {
    const result = await pool.query(
      "UPDATE mensajes SET ruta_img=$1 WHERE id=$2 RETURNING *",
      [ruta_img, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Mensaje no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/mensajes/:id
app.put("/api/mensajes/:id", async (req, res) => {
  const { personaje_id, mensaje, fecha_simulada, hora_simulada, orden } = req.body;
  const mensajeId = req.params.id;

  // Validaciones
  if (!personaje_id)
    return res.status(400).json({ error: "Debe seleccionar un personaje" });
  if (orden === undefined || orden === null)
    return res.status(400).json({ error: "Debe enviar el orden del mensaje" });

  try {
    const result = await pool.query(
      `UPDATE mensajes 
       SET personaje_id=$1, mensaje=$2, fecha_simulada=$3, hora_simulada=$4, orden=$5
       WHERE id=$6
       RETURNING *`,
      [
        personaje_id,
        mensaje || "",
        fecha_simulada || null,
        hora_simulada || null,
        orden,
        mensajeId,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Mensaje no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error al actualizar mensaje:", err.message);
    res.status(500).json({ error: "Error al actualizar mensaje" });
  }
});


// ====================== WHATSAPP ======================

// Obtener último mensaje de cada conversación (tipo menú WhatsApp)
app.get("/api/mensajes-menu-wsp", async (req, res) => {
  try {
    const query = `
      SELECT 
        c.conversacion_id,
        m.id AS mensaje_id,
        m.mensaje,
        m.orden,
        m.fecha_simulada,
        m.hora_simulada,
        p.ruta_img,
        p.nombre
      FROM conversaciones c
      JOIN mensajes m 
        ON c.conversacion_id = m.conversacion_id
      JOIN personajes p
        ON p.id = c.personaje_id
      WHERE m.orden = (
        SELECT MAX(orden) 
        FROM mensajes 
        WHERE conversacion_id = c.conversacion_id
      ) and p.nombre <> 'Monserrat'
	  
      ORDER BY c.conversacion_id DESC
    `;

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener mensajes de una conversación específica
app.get("/api/mensajes-wsp/:conversacionId", async (req, res) => {
  try {
    const conversacionId = req.params.conversacionId;

    const query = `
      SELECT m.personaje_id, p.ruta_img as personaje_ruta_img, m.mensaje, p.nombre, m.hora_simulada, m.ruta_img
      FROM mensajes m
      JOIN personajes p ON p.id = m.personaje_id
      WHERE m.conversacion_id = $1
      ORDER BY m.orden ASC;
    `;

    const result = await pool.query(query, [conversacionId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// ====================== INICIO ======================

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
