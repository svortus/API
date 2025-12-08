import { createUser, userConflictResolution, getLastUpdated as getUsersLastUpdated, getSinceUsers } from "../services/usersService.js";
import { breedConflictResolution, createBreed, getLastUpdated as getBreedsLastUpdated, getSinceBreeds } from "../services/breedsService.js";
import { createAnimal, animalConflictResolution, getSinceAnimals, getLastUpdated as getAnimalsLastUpdated } from "../services/animalsService.js";
import { birthConflictResolution, createBirth, getLastUpdated as getBirthsLastUpdated, getSinceBirths } from "../services/birthsService.js";
import { createDisease, diseaseConflictResolution, getLastUpdated as getDiseasesLastUpdated, getSinceDiseases } from "../services/diseasesService.js";
import { createMedication, medicationConflictResolution, getLastUpdated as getMedicationsLastUpdated, getSinceMedications } from "../services/medicationsService.js";
import { createMilkProduction, milkProductionConflictResolution, getLastUpdated as getMilkProductionsLastUpdated, getSinceMilkProductions } from "../services/milk_productionService.js";
import { createPregnantCow, pregnantCowConflictResolution, getLastUpdated as getPregnantCowsLastUpdated, getSincePregnantCows } from "../services/pregnant_cowService.js";
import { createSalesRecord, salesRecordConflictResolution, getLastUpdated as getSalesRecordsLastUpdated, getSinceSalesRecords } from "../services/sales_recordService.js";
import { createWeightHistory, weightHistoryConflictResolution, getLastUpdated as getWeightHistoriesLastUpdated, getSinceWeightHistories } from "../services/weight_historyService.js";

import express from "express";
import { ChangeSyncedMiddleware, ApiKey } from "../middlewares/syncMiddleware.js";
const router = express.Router();

router.post("/users", ApiKey, ChangeSyncedMiddleware, userConflictResolution);
router.post("/animals", ApiKey, ChangeSyncedMiddleware, animalConflictResolution);
router.post("/breeds", ApiKey, ChangeSyncedMiddleware, breedConflictResolution);
router.post("/births", ApiKey, ChangeSyncedMiddleware, birthConflictResolution);
router.post("/diseases", ApiKey, ChangeSyncedMiddleware, diseaseConflictResolution);
router.post("/medications", ApiKey, ChangeSyncedMiddleware, medicationConflictResolution);
router.post("/milkProductions", ApiKey, ChangeSyncedMiddleware, milkProductionConflictResolution);
router.post("/pregnantCows", ApiKey, ChangeSyncedMiddleware, pregnantCowConflictResolution);
router.post("/salesRecords", ApiKey, ChangeSyncedMiddleware, salesRecordConflictResolution);
router.post("/weightHistories", ApiKey, ChangeSyncedMiddleware, weightHistoryConflictResolution);

router.get("/h", ApiKey);

router.get("/animals/lastUpdated", ApiKey, getAnimalsLastUpdated);
router.get("/births/lastUpdated", ApiKey, getBirthsLastUpdated);
router.get("/breeds/lastUpdated", ApiKey, getBreedsLastUpdated);
router.get("/diseases/lastUpdated", ApiKey, getDiseasesLastUpdated);
router.get("/medications/lastUpdated", ApiKey, getMedicationsLastUpdated);
router.get("/milkProductions/lastUpdated", ApiKey, getMilkProductionsLastUpdated);
router.get("/pregnantCows/lastUpdated", ApiKey, getPregnantCowsLastUpdated);
router.get("/salesRecords/lastUpdated", ApiKey, getSalesRecordsLastUpdated);
router.get("/users/lastUpdated", ApiKey, getUsersLastUpdated);
router.get("/weightHistories/lastUpdated", ApiKey, getWeightHistoriesLastUpdated);

router.get("/animals", ApiKey, getSinceAnimals);
router.get("/births", ApiKey, getSinceBirths);
router.get("/breeds", ApiKey, getSinceBreeds);
router.get("/diseases", ApiKey, getSinceDiseases);
router.get("/medications", ApiKey, getSinceMedications);
router.get("/milkProductions", ApiKey, getSinceMilkProductions);
router.get("/pregnantCows", ApiKey, getSincePregnantCows);
router.get("/salesRecords", ApiKey, getSinceSalesRecords);
router.get("/users", ApiKey, getSinceUsers);
router.get("/weightHistories", ApiKey, getSinceWeightHistories);

export default router;