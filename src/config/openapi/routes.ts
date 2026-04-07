import { registry } from './openapi';
import { z } from 'zod';
import { RegisterDataSchema } from '../../auth/dto/registerData.dto';
import { LoginDataSchema } from '../../auth/dto/loginData.dto';
import { CreateProviderDataSchema } from '../../providers/dto/createProviderData.dto';
import { UpdateProviderDataSchema } from '../../providers/dto/updateProviderData.dto';
import { CreateServiceSchema } from '../../services/dto/createService.dto';
import { UpdateServiceSchema } from '../../services/dto/updateService.dto';
import { schedulerSchema, schedulersArraySchema } from '../../services/dto/scheduler.dto';
import { CreateCustomerDataSchema } from '../../services/dto/createCustomerData.dto';
import { CreateBookingSchema } from '../../bookings/dto/createBooking.dto';
import { UpdateBookingStatusSchema } from '../../bookings/dto/updateBookingStatus.dto';

const bearerAuth = registry.registerComponent('securitySchemes', 'BearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
});

// --- Auth ---

registry.registerPath({
  method: 'post',
  path: '/auth/register',
  tags: ['Auth'],
  summary: 'Inscription d\'un nouvel utilisateur',
  request: { body: { content: { 'application/json': { schema: RegisterDataSchema } } } },
  responses: {
    201: { description: 'Utilisateur créé avec succès' },
    400: { description: 'Données invalides' },
    409: { description: 'Email déjà utilisé' },
  },
});

registry.registerPath({
  method: 'post',
  path: '/auth/login',
  tags: ['Auth'],
  summary: 'Connexion utilisateur',
  request: { body: { content: { 'application/json': { schema: LoginDataSchema } } } },
  responses: {
    200: { description: 'Connexion réussie (access token + refresh token cookie)' },
    400: { description: 'Données invalides' },
    401: { description: 'Identifiants incorrects' },
  },
});

registry.registerPath({
  method: 'post',
  path: '/auth/refresh-token',
  tags: ['Auth'],
  summary: 'Rafraîchir le token d\'accès',
  responses: {
    200: { description: 'Nouveau access token' },
    401: { description: 'Refresh token invalide ou expiré' },
  },
});

// --- User ---

registry.registerPath({
  method: 'get',
  path: '/user/me',
  tags: ['User'],
  summary: 'Récupérer le profil de l\'utilisateur connecté',
  security: [{ [bearerAuth.name]: [] }],
  responses: {
    200: { description: 'Profil utilisateur' },
    401: { description: 'Non authentifié' },
  },
});

// --- Providers ---

registry.registerPath({
  method: 'post',
  path: '/providers',
  tags: ['Providers'],
  summary: 'Créer un fournisseur de services',
  security: [{ [bearerAuth.name]: [] }],
  request: { body: { content: { 'application/json': { schema: CreateProviderDataSchema } } } },
  responses: {
    201: { description: 'Fournisseur créé' },
    400: { description: 'Données invalides' },
    409: { description: 'linkCode déjà utilisé' },
  },
});

registry.registerPath({
  method: 'get',
  path: '/providers/me',
  tags: ['Providers'],
  summary: 'Récupérer le profil du fournisseur connecté',
  security: [{ [bearerAuth.name]: [] }],
  responses: {
    200: { description: 'Profil fournisseur' },
    401: { description: 'Non authentifié' },
  },
});

registry.registerPath({
  method: 'put',
  path: '/providers/me',
  tags: ['Providers'],
  summary: 'Mettre à jour le profil du fournisseur',
  security: [{ [bearerAuth.name]: [] }],
  request: { body: { content: { 'application/json': { schema: UpdateProviderDataSchema } } } },
  responses: {
    200: { description: 'Profil mis à jour' },
    400: { description: 'Données invalides' },
  },
});

// --- Services ---

registry.registerPath({
  method: 'post',
  path: '/providers/service',
  tags: ['Services'],
  summary: 'Créer un service avec options et créneaux',
  security: [{ [bearerAuth.name]: [] }],
  request: { body: { content: { 'application/json': { schema: CreateServiceSchema } } } },
  responses: {
    201: { description: 'Service créé' },
    400: { description: 'Données invalides' },
  },
});

registry.registerPath({
  method: 'get',
  path: '/providers/service',
  tags: ['Services'],
  summary: 'Récupérer le service du fournisseur',
  security: [{ [bearerAuth.name]: [] }],
  responses: {
    200: { description: 'Service avec options et créneaux' },
    404: { description: 'Aucun service trouvé' },
  },
});

registry.registerPath({
  method: 'put',
  path: '/providers/service',
  tags: ['Services'],
  summary: 'Mettre à jour le service',
  security: [{ [bearerAuth.name]: [] }],
  request: { body: { content: { 'application/json': { schema: UpdateServiceSchema } } } },
  responses: {
    200: { description: 'Service mis à jour' },
    400: { description: 'Données invalides' },
  },
});

// --- Schedulers ---

registry.registerPath({
  method: 'post',
  path: '/providers/service/{serviceId}/scheduler',
  tags: ['Schedulers'],
  summary: 'Ajouter des créneaux horaires à un service',
  security: [{ [bearerAuth.name]: [] }],
  request: {
    params: z.object({ serviceId: z.string().uuid() }),
    body: {
      content: {
        'application/json': {
          schema: z.object({ schedulers: schedulersArraySchema }),
        },
      },
    },
  },
  responses: {
    201: { description: 'Créneaux ajoutés' },
    400: { description: 'Données invalides' },
  },
});

registry.registerPath({
  method: 'put',
  path: '/providers/service/{serviceId}/scheduler',
  tags: ['Schedulers'],
  summary: 'Modifier un créneau horaire',
  security: [{ [bearerAuth.name]: [] }],
  request: {
    params: z.object({ serviceId: z.string().uuid() }),
    body: { content: { 'application/json': { schema: schedulerSchema } } },
  },
  responses: {
    200: { description: 'Créneau mis à jour' },
    400: { description: 'Données invalides' },
  },
});

registry.registerPath({
  method: 'delete',
  path: '/providers/scheduler/{scheduleId}',
  tags: ['Schedulers'],
  summary: 'Supprimer un créneau (seulement si non réservé)',
  security: [{ [bearerAuth.name]: [] }],
  request: {
    params: z.object({ scheduleId: z.string().uuid() }),
  },
  responses: {
    200: { description: 'Créneau supprimé' },
    404: { description: 'Créneau non trouvé ou déjà réservé' },
  },
});

// --- Customers ---

registry.registerPath({
  method: 'post',
  path: '/providers/customer',
  tags: ['Customers'],
  summary: 'Créer un client',
  security: [{ [bearerAuth.name]: [] }],
  request: { body: { content: { 'application/json': { schema: CreateCustomerDataSchema } } } },
  responses: {
    201: { description: 'Client créé' },
    400: { description: 'Données invalides' },
  },
});

registry.registerPath({
  method: 'get',
  path: '/providers/customer/{id}',
  tags: ['Customers'],
  summary: 'Récupérer un client par ID',
  security: [{ [bearerAuth.name]: [] }],
  request: { params: z.object({ id: z.string() }) },
  responses: {
    200: { description: 'Détail du client' },
    404: { description: 'Client non trouvé' },
  },
});

registry.registerPath({
  method: 'get',
  path: '/providers/customers',
  tags: ['Customers'],
  summary: 'Liste paginée des clients',
  security: [{ [bearerAuth.name]: [] }],
  request: {
    query: z.object({
      page: z.string().optional(),
      limit: z.string().optional(),
    }),
  },
  responses: {
    200: { description: 'Liste de clients avec pagination' },
  },
});

registry.registerPath({
  method: 'put',
  path: '/providers/customer/{id}',
  tags: ['Customers'],
  summary: 'Mettre à jour un client',
  security: [{ [bearerAuth.name]: [] }],
  request: {
    params: z.object({ id: z.string() }),
    body: { content: { 'application/json': { schema: CreateCustomerDataSchema } } },
  },
  responses: {
    200: { description: 'Client mis à jour' },
    400: { description: 'Données invalides' },
  },
});

registry.registerPath({
  method: 'delete',
  path: '/providers/customer/{id}',
  tags: ['Customers'],
  summary: 'Supprimer un client',
  security: [{ [bearerAuth.name]: [] }],
  request: { params: z.object({ id: z.string() }) },
  responses: {
    200: { description: 'Client supprimé' },
    404: { description: 'Client non trouvé' },
  },
});

// --- Bookings (public) ---

registry.registerPath({
  method: 'post',
  path: '/bookings/service/{serviceId}',
  tags: ['Bookings'],
  summary: 'Créer une réservation (endpoint public, sans authentification)',
  request: {
    params: z.object({ serviceId: z.string().uuid() }),
    body: { content: { 'application/json': { schema: CreateBookingSchema } } },
  },
  responses: {
    201: { description: 'Réservation créée' },
    400: { description: 'Données invalides' },
    409: { description: 'Créneau non disponible ou déjà réservé' },
  },
});

// --- Bookings (provider) ---

registry.registerPath({
  method: 'get',
  path: '/providers/bookings',
  tags: ['Bookings'],
  summary: 'Liste paginée des réservations du fournisseur',
  security: [{ [bearerAuth.name]: [] }],
  request: {
    query: z.object({
      page: z.string().optional(),
      limit: z.string().optional(),
    }),
  },
  responses: {
    200: { description: 'Liste de réservations avec pagination' },
  },
});

registry.registerPath({
  method: 'get',
  path: '/providers/bookings/{id}',
  tags: ['Bookings'],
  summary: 'Détail d\'une réservation',
  security: [{ [bearerAuth.name]: [] }],
  request: { params: z.object({ id: z.string().uuid() }) },
  responses: {
    200: { description: 'Détail de la réservation avec client et créneau' },
    404: { description: 'Réservation non trouvée' },
  },
});

registry.registerPath({
  method: 'put',
  path: '/providers/bookings/{id}',
  tags: ['Bookings'],
  summary: 'Mettre à jour le statut d\'une réservation (CONFIRMED / CANCELLED)',
  security: [{ [bearerAuth.name]: [] }],
  request: {
    params: z.object({ id: z.string().uuid() }),
    body: { content: { 'application/json': { schema: UpdateBookingStatusSchema } } },
  },
  responses: {
    200: { description: 'Statut mis à jour' },
    400: { description: 'Données invalides' },
    404: { description: 'Réservation non trouvée' },
  },
});

registry.registerPath({
  method: 'delete',
  path: '/providers/bookings/{id}',
  tags: ['Bookings'],
  summary: 'Supprimer une réservation',
  security: [{ [bearerAuth.name]: [] }],
  request: { params: z.object({ id: z.string().uuid() }) },
  responses: {
    200: { description: 'Réservation supprimée' },
    404: { description: 'Réservation non trouvée' },
  },
});

// --- Currencies ---

registry.registerPath({
  method: 'get',
  path: '/currencies',
  tags: ['Currencies'],
  summary: 'Liste des devises supportées',
  responses: {
    200: { description: 'Liste des devises' },
  },
});
