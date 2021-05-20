# Create a simulator object
set ns [new Simulator]

# Open the NAM trace file
set tf [open out.tr w]
$ns trace-all $tf

# Define a 'finish' procedure
proc finish {} {
global ns tf
$ns flush-trace
close $tf
exit 0
}

# Create two nodes
set n0 [$ns node]
set n1 [$ns node]

# Create links between the nodes
$ns duplex-link $n0 $n1 2Mb 10ms DropTail

# Setup UDP connection
set udp [new Agent/UDP]
$ns attach-agent $n0 $udp
set null [new Agent/Null]
$ns attach-agent $n1 $null
$ns connect $udp $null

# Setup a CBR over UDP connection
set cbr [new Application/Traffic/CBR]
$cbr attach-agent $udp
$cbr set type CBR
$cbr set packetsize 1000
$cbr set rate 1mb

# Schedule events for the CBR agents
$ns at 0.1 "$cbr start"
$ns at 4.5 "$cbr stop"

# Call the finish procedure after 5 seconds of simulation time
$ns at 5.0 "finish"

# Print the CBR packet size and interval
puts "CBR packet size = [$cbr set packetsize]"
puts "CBR interval = [$cbr set interval_]"

# Run the simulation
$ns run