import "@testing-library/jest-dom";
import { vi } from "vitest";

// Previne erros em hooks que disparam window.alert
global.alert = vi.fn();
