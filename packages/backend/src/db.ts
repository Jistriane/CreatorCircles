import mongoose from 'mongoose';

function getCompatibleUri(uri: string) {
  if (!uri) throw new Error('MONGODB_URI is required');
  // Se estiver usando localhost, tenta também mongodb (para Docker)
  if (uri.includes('localhost')) {
    return [uri, uri.replace('localhost', 'mongodb')];
  }
  if (uri.includes('mongodb')) {
    return [uri, uri.replace('mongodb', 'localhost')];
  }
  return [uri];
}

export async function connectDb(uri: string) {
  const uris = getCompatibleUri(uri);
  let lastError;
  for (const u of uris) {
    try {
      await mongoose.connect(u, {});
      console.log(`[db] Connected to MongoDB: ${u}`);
      return;
    } catch (err) {
      lastError = err;
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`[db] Falha ao conectar em ${u}:`, msg);
    }
  }
  throw lastError || new Error('Não foi possível conectar ao MongoDB');
}

export default mongoose;
