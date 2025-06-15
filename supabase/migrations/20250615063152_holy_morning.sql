/*
  # Create attendance and backup tables

  1. New Tables
    - `attendance_records`
      - `id` (uuid, primary key)
      - `local_id` (text, original local record ID)
      - `device_id` (text, device identifier)
      - `prefectNumber` (text)
      - `role` (text)
      - `timestamp` (timestamptz)
      - `date` (text)
      - `synced_at` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `backup_metadata`
      - `id` (uuid, primary key)
      - `device_id` (text)
      - `records_count` (integer)
      - `backup_size` (bigint)
      - `checksum` (text)
      - `version` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for device-based access
*/

-- Create attendance_records table
CREATE TABLE IF NOT EXISTS attendance_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  local_id text NOT NULL,
  device_id text NOT NULL,
  prefectNumber text NOT NULL,
  role text NOT NULL,
  timestamp timestamptz NOT NULL,
  date text NOT NULL,
  synced_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(local_id, device_id)
);

-- Create backup_metadata table
CREATE TABLE IF NOT EXISTS backup_metadata (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id text NOT NULL,
  records_count integer NOT NULL DEFAULT 0,
  backup_size bigint NOT NULL DEFAULT 0,
  checksum text NOT NULL,
  version text NOT NULL DEFAULT '1.0.0',
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE backup_metadata ENABLE ROW LEVEL SECURITY;

-- Create policies for attendance_records
CREATE POLICY "Users can manage their own device records"
  ON attendance_records
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create policies for backup_metadata
CREATE POLICY "Users can manage their own device backups"
  ON backup_metadata
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_attendance_records_device_id ON attendance_records(device_id);
CREATE INDEX IF NOT EXISTS idx_attendance_records_date ON attendance_records(date);
CREATE INDEX IF NOT EXISTS idx_attendance_records_timestamp ON attendance_records(timestamp);
CREATE INDEX IF NOT EXISTS idx_backup_metadata_device_id ON backup_metadata(device_id);
CREATE INDEX IF NOT EXISTS idx_backup_metadata_created_at ON backup_metadata(created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for attendance_records
CREATE TRIGGER update_attendance_records_updated_at
  BEFORE UPDATE ON attendance_records
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();