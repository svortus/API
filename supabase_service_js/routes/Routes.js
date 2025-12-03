import { createUser, userConflictResolution } from "../services/usersService.js";
import { breedConflictResolution, createBreed } from "../services/breedsService.js";
import { createAnimal,animalConflictResolution, getAnimals } from "../services/animalsService.js";
import { birthConflictResolution, createBirth } from "../services/birthsService.js";
import { createDisease, diseaseConflictResolution } from "../services/diseasesService.js";
import { createMedication, medicationConflictResolution } from "../services/medicationsService.js";
import { createMilkProduction, milkProductionConflictResolution } from "../services/milk_productionService.js";
import { createPregnantCow, pregnantCowConflictResolution } from "../services/pregnant_cowService.js";
import { createSalesRecord, salesRecordConflictResolution } from "../services/sales_recordService.js";
import { createWeightHistory, weightHistoryConflictResolution } from "../services/weight_historyService.js";

import express from "express";
import { ChangeSyncedMiddleware, ApiKey} from "../middlewares/syncMiddleware.js";
const router = express.Router();

router.post("/users",ApiKey,ChangeSyncedMiddleware, userConflictResolution);
router.post("/animals",ApiKey, ChangeSyncedMiddleware,animalConflictResolution);
router.post("/breeds",ApiKey, ChangeSyncedMiddleware, breedConflictResolution);
router.post("/births",ApiKey, ChangeSyncedMiddleware, birthConflictResolution);
router.post("/diseases",ApiKey, ChangeSyncedMiddleware, diseaseConflictResolution);
router.post("/medications",ApiKey, ChangeSyncedMiddleware, medicationConflictResolution);
router.post("/milk_productions",ApiKey, ChangeSyncedMiddleware, milkProductionConflictResolution);
router.post("/pregnant_cows",ApiKey, ChangeSyncedMiddleware, pregnantCowConflictResolution);
router.post("/sales_records",ApiKey, ChangeSyncedMiddleware, salesRecordConflictResolution);
router.post("/weight_histories",ApiKey, ChangeSyncedMiddleware, weightHistoryConflictResolution);

router.get("/h",ApiKey);
router.get("/animals",ApiKey, getAnimals);
export default router;