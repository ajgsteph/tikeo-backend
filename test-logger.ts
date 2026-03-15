import { logger } from './src/shared/logger/logger.service';

console.log('\n=== TEST LOGGER EN MODE DEVELOPMENT ===\n');

// Test 1: Log simple
logger.log('Ceci est un log info simple');

// Test 2: Log avec métadonnées
logger.log('Utilisateur connecté', {
    userId: 'user-123',
    email: 'test@example.com',
    ip: '192.168.1.1'
});

// Test 3: Warning
logger.warn('Attention : Mémoire élevée', {
    memoryUsage: '85%',
    threshold: '80%'
});

// Test 4: Error sans metadata
logger.error('Connexion à la base de données échouée');

// Test 5: Error avec stack trace
try {
    throw new Error('Une erreur de test');
} catch (error: any) {
    logger.error('Erreur capturée', {
        message: error.message,
        stack: error.stack,
        code: 'TEST_ERROR'
    });
}

// Test 6: Log avec objet complexe
logger.log('Commande créée', {
    orderId: 'order-456',
    user: {
        id: 'user-123',
        name: 'John Doe'
    },
    items: [
        { id: 1, name: 'Product A', price: 29.99 },
        { id: 2, name: 'Product B', price: 49.99 }
    ],
    total: 79.98,
    timestamp: new Date()
});

console.log('\n=== FIN DES TESTS ===\n');