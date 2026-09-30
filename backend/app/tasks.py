"""Background task registration.

OCR and extraction tasks are intentionally added in ordered Build Steps 2 and
3. Keeping this module importable lets the worker boot during Step 1 without
returning placeholder educational data.
"""
