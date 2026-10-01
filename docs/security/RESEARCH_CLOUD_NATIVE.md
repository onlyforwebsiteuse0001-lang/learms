# Cloud-native research

Use CIS-aligned restricted pods, non-root/read-only containers, dropped capabilities, seccomp/AppArmor, network policies, short-lived service identities, and no public DB/Redis. Falco/Tetragon can detect runtime process/syscall/network anomalies, but rules require tuning and an incident response path. Container scans are necessary but do not prove runtime safety.
